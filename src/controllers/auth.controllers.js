import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js";

const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something Went Wrong while generarting Tokens",
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (existingUser) {
        throw new ApiError(409, "User Already Exists", []);
    }

    const user = await User.create({
        username,
        email,
        password,
        isEmailVerified: false,
    });

    const { unHashedToken, hashedToken, tokenExpiry } =
        user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;
    await user.save({ validateBeforeSave: false });

    await sendEmail({
        email: user?.email,
        subject: "Please Verify Your Email",
        mailgenContent: emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedToken}`,
        ),
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went Wrong while registering User");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { user: createdUser },
                "User Created Successfully and Verification email sent on your email",
            ),
        );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;

    if (!email && !username) {
        throw new ApiError(400, "Username or Email is Required");
    }

    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (!user) {
        throw new ApiError(400, "Username doesn't Exist Please Register");
    }

    const validPassword = await user.isPasswordCorrect(password);

    if (!validPassword) {
        throw new ApiError(400, "Invalid Credentials");
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);

    const loggedUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedUser,
                    accessToken,
                    refreshToken,
                },
                "User Logged In",
            ),
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        },
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User LoggedOut successfully!"));
});

export { registerUser, loginUser, logoutUser };
