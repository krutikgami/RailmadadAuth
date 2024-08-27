import { Router } from "express";
import { loginUser,registerUser } from "../controllers/user.controller.js";

const router = Router();


router.route('/register').post(registerUser)   

 router.route("/login").post(loginUser);

// router.route("/logout").post(verifyJWT,logoutUser);
// router.route("/refresh-token").post(refreshAccessToken)

export default router