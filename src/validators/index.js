import { body } from "express-validator";
import { AvailableUserRole } from "../utils/constants.js";

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

const createProjectValidator = () => {
    return [
        body("name").notEmpty().withMessage("Name is Required"),
        body("description").optional(),
    ];
};

const addMemberToProjectValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is Required")
            .isEmail()
            .withMessage("Email is Invalid"),
        body("role")
            .notEmpty()
            .withMessage("Role is Required")
            .isIn(AvailableUserRole)
            .withMessage("Role is Invalid"),
    ];
};

export {
    userRegisterValidator,
    userLoginValidator,
    userChangePasswordValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator,
    createProjectValidator,
    addMemberToProjectValidator,
};
