import { Router } from "express";
import {
    changePassword,
    forgotPasswordRequest,
    getCurrentUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    resendEmailVerification,
    resetForgotPassword,
    verifyEmail,
} from "../controllers/auth.controllers.js";
import { validate } from "../middleware/validator.middleware.js";
import {
    userChangePasswordValidator,
    userForgotPasswordValidator,
    userLoginValidator,
    userRegisterValidator,
    userResetForgotPasswordValidator,
} from "../validators/index.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

//unsecured Routes
router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator(), validate, loginUser);
router.route("/verify-email/:verificationToken").get(verifyEmail);
router.route("/refresh-token").post(refreshAccessToken);
router
    .route("/forgot-password")
    .post(userForgotPasswordValidator(), validate, forgotPasswordRequest);
router
    .route("/reset-password/:resetToken")
    .post(userResetForgotPasswordValidator(), validate, resetForgotPassword);

//secured Routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").post(verifyJWT, getCurrentUser);
router
    .route("/change-password")
    .post(verifyJWT, userChangePasswordValidator(), validate, changePassword);
router
    .route("/resend-email-verification")
    .post(verifyJWT, resendEmailVerification);


export default router;
