import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
} from "../controllers/auth.controllers.js";
import { validate } from "../middleware/validator.middleware.js";
import {
    userLoginValidator,
    userRegisterValidator,
} from "../validators/index.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator(), validate, loginUser);
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
