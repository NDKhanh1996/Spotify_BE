import {Users} from "../../models/schemas/Users";
import {RefreshTokens} from "../../models/schemas/RefreshToken";
import bcrypt from "bcrypt";
import {Security} from "../../security/security";
import {SongLikeCounts} from "../../models/schemas/SongLikeCounts";
import {PlaylistLikeCounts} from "../../models/schemas/PlaylistLikeCounts";

export class AuthController {
    static async register(req: any, res: any) {
        const {firstname, lastname, username, password, phoneNumber, gender, avatar} = req.body;
        try {
            const existingUser = await Users.findOne({username});

            if (existingUser) {
                if (req.authMethod === "jwt") {
                    return res.status(409).json("Account already exists");
                }
                return;
            }

            let hashedPassword = password;
            if (password) {
                hashedPassword = await bcrypt.hash(password, 10);
            }

            await Users.create({
                firstName: firstname,
                lastName: lastname,
                username,
                phoneNumber,
                gender,
                avatar,
                password: hashedPassword,
                role: 'user'
            });

            if (req.authMethod !== "google") {
                res.status(201).json({message: 'Sign up success!'});
            }
        } catch (e) {
            res.status(500).json({message: 'Server error!'});
        }
    }


    static async login(req: any, res: any) {
        const {username, password} = req.body;
        try {
            const user = await Users.findOne({username})
                .populate({path: 'songLikeCounts', model: SongLikeCounts})
                .populate({path: 'playlistLikeCounts', model: PlaylistLikeCounts});
            if (!user) {
                return res.status(404).json({message: 'Username does not exist!'});
            }

            if (req.authMethod !== 'google') {
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    return res.status(401).json({message: 'Incorrect password!'});
                }
            }

            const accessToken = Security.accessToken(user);
            const refreshToken = Security.refreshToken(user);

            await RefreshTokens.create({
                refreshToken: refreshToken,
                user: user
            });

            res.status(200).json({
                message: 'Logged in successfully!',
                accessToken: accessToken,
                refreshToken: refreshToken,
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    role: user.role,
                    phoneNumber: user.phoneNumber,
                    gender: user.gender,
                    avatar: user.avatar,
                    playlist: user.playlist,
                    songsUploaded: user.songsUploaded,
                    songLikeCounts: user.songLikeCounts,
                    playlistLikeCounts: user.playlistLikeCounts
                }
            });
        } catch (e) {
            res.status(500).json({message: e.message, location: "auth.controller.login"});
        }
    }

    static reqRefreshToken(req: any, res: any, next: any) { // use to refresh token
        Security.reqRefreshToken(req, res, next)
            .then()
            .catch(e => {
                res.status(500).json({message: e.message})
            });
    }
}
