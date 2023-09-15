import jwt from "jsonwebtoken";
import { RefreshTokens } from "../models/schemas/RefreshToken";
import { OAuth2Client } from 'google-auth-library';
import { AuthController } from "../controllers/authController/auth.controller";

export class Security {
    private static jwtSecretKey: string = '123456';
    private static JwtRefreshKey: string = '123456';

    static accessToken(user: any) {
        return jwt.sign({
            id: user._id || user.id,
            role: user.role || user.id
        },
            Security.jwtSecretKey,
            { expiresIn: "5h" }
        );
    }

    static refreshToken(user: any) {
        return jwt.sign({
            id: user._id || user.id,
            role: user.role || user.id
        },
            Security.JwtRefreshKey,
            { expiresIn: "2h" }
        );
    }

    static async googleLogin(req: any, res: any, next: any) {
        const idToken = req.body.token;
        const clientId = "683585484602-h399cig7631kcaq65kpn1a3nva3mco5m.apps.googleusercontent.com";
        try {
            const client = new OAuth2Client(clientId);
            const ticket = await client.verifyIdToken({
                idToken,
                audience: clientId
            });
            req.authMethod = "google";
            req.body = ticket.getPayload();
            req.body = {
                ...req.body,
                username: req.body.email,
                firstname: req.body.given_name,
                lastname: req.body.family_name,
                avatar: req.body.picture,
                password: null,
            };
            await AuthController.register(req, res);
            await AuthController.login(req, res);
        } catch (e) {
            res.status(401).json('Google token verification failed');
        }
    }

    static verifyToken(req: any, res: any, next: any) {
        const token = req.headers.token;
        if (!token) {
            return res.status(401).json("You are not authenticated");
        }

        const accessToken = token.split(" ")[1];
        try {
            req.user = jwt.verify(accessToken, Security.jwtSecretKey);
            req.authMethod = "jwt";
            next();
        } catch (e) {
            res.status(401).json({message: "Token Invalid", error: e.message, location: "Security.verifyToken"});
        }
    }

    static async reqRefreshToken(req: any, res: any, next: any) {
        const refreshToken = req.headers['refreshtoken'];
        if (!refreshToken) {
            return res.status(401).json("Token not found");
        }

        const existingRefreshToken = await RefreshTokens.findOne({ refreshToken });
        if (!existingRefreshToken) {
            return res.status(401).json("Refresh token is not valid");
        }

        const user = jwt.verify(refreshToken, Security.JwtRefreshKey);
        await RefreshTokens.deleteOne({ refreshToken: refreshToken });
        const newAccessToken = Security.accessToken(user);
        const newRefreshToken = Security.refreshToken(user);
        await RefreshTokens.create({
            refreshToken: newRefreshToken,
            user: user['id']
        });
        res.status(201).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    }

    static checkAdmin(req: any, res: any, next: any) {
        req.user.role === 'admin' ? next() : res.status(403).json("Only admin can do that");
    }
}