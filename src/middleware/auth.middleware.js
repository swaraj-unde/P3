import mongoose from "mongoose";
import { ProjectMember } from "../models/projectMember.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Unauthorized Access");
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
        );

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;

        return next();
    } catch (error) {
        console.log(error.message);

        throw new ApiError(401, "Unauthorized Access");
    }
});

export const validateProjectPermissions = (roles = []) => {
    asyncHandler(async (req, res) => {
        const { projectId } = req.params;
        if (!projectId) {
            throw new ApiError(400, "Project id Missing");
        }
        const project = await ProjectMember.findOne({
            project: new mongoose.Types.ObjectId(projectId),
            user: new mongoose.Types.ObjectId(req.user._id),
        });
        if (!project) {
            throw new ApiError(404, "Project Not Found");
        }

        const givenRole = project?.role;

        req.user.role = givenRole;

        if (!roles.includes(givenRole)) {
            throw new ApiError(404, "Unauthorized Access");
        }

        next();
    });
};
