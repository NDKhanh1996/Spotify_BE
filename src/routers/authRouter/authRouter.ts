import {Router} from "express";
import {AuthController} from "../../controllers/authController/auth.controller";
import {Security} from "../../security/security";

const authRouter = Router();

authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login);
authRouter.post('/google-login', Security.googleLogin);
authRouter.post('/refresh-token', AuthController.reqRefreshToken);

export default authRouter;