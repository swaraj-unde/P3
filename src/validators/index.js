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
            .trim()
            .notEmpty()
            .withMessage("Username is Required")
            .isLowercase()
            .withMessage("Must be in lowercase")
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

export { userRegisterValidator, userLoginValidator };
