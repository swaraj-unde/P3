import { body } from "express-validator";

const userRegisterValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is Required")
            .isEmail()
            .withMessage("Email is Invalid"),
        body("username")
            .toLowerCase()
            .trim()
            .notEmpty()
            .withMessage("Username is Required")
            .isLength({ min: 3 })
            .withMessage("Username must be atleast of length 3"),
        body("password").trim().notEmpty().withMessage("Password is required"),
        body("fullName").optional().trim(),
    ];
};

const userLoginValidator = () => {
    return [
        body("email")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("Email is Required")
            .isEmail()
            .withMessage("Email is Invalid"),
        body("password").trim().notEmpty().withMessage("Password is required"),
    ];
};

const userChangePasswordValidator = () => {
    return [
        body("oldPassword").notEmpty().withMessage("Old Password is Required"),
        body("newPassword").notEmpty().withMessage("New Password is Required"),
    ];
};

const userForgotPasswordValidator = () => {
    return [
        body("email")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("Email is Required")
            .isEmail()
            .withMessage("Email is Invalid"),
    ];
};

const userResetForgotPasswordValidator = () => {
    return [
        body("newPassword").notEmpty().withMessage("New Password is Required"),
    ];
};

export {
    userRegisterValidator,
    userLoginValidator,
    userChangePasswordValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator,
};
