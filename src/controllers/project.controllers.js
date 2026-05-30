import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import { ProjectMember } from "../models/projectMember.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const getProjects = asyncHandler(async (req, res) => {
    const projects = await ProjectMember.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(req.user._id),
            },
        },
        {
            $lookup: {
                from: "projects",
                localField: "project",
                foreignField: "_id",
                as: "project",
                pipeline: [
                    {
                        $lookup: {
                            from: "projectmembers",
                            localField: "_id",
                            foreignField: "project",
                            as: "projectMembers",
                        },
                    },
                    {
                        $addFields: {
                            members: {
                                $size: "$projectMembers",
                            },
                        },
                    },
                ],
            },
        },
        {
            $unwind: "$project",
        },
        {
            $project: {
                project: {
                    _id: "$project._id",
                    name: "$project.name",
                    description: "$project.description",
                    members: "$project.members",
                    createdAt: "$project.createdAt",
                    createdBy: "$project.createdBy",
                },
                role: 1,
                _id: 0,
            },
        },
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, projects, "Projects Fetched Successfully"));
});

const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project Not Found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, project, "Project fetched Successfully"));
});

const createProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    const project = await Project.create({
        name,
        description,
        createdBy: new mongoose.Types.ObjectId(req.user._id),
    });

    await ProjectMember.create({
        user: new mongoose.Types.ObjectId(req.user._id),
        project: new mongoose.Types.ObjectId(project._id),
        role: UserRolesEnum.ADMIN,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, project, "Project Created Successfully"));
});

const updateProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const { projectId } = req.params;

    const updateFields = {};

    if (name) updateFields.name = name;
    if (description) updateFields.description = description;

    const project = await Project.findByIdAndUpdate(projectId, updateFields, {
        new: true,
    });

    if (!project) {
        throw new ApiError(404, "Project Not Found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, project, "Project updated Successfully"));
});

const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const project = await Project.findByIdAndDelete(projectId);

    if (!project) {
        throw new ApiError(404, "Project Not Found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, project, "Project updated Successfully"));
});

const addMembersToProject = asyncHandler(async (req, res) => {
    const { email, role } = req.body;
    const { projectId } = req.params;
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User Not Found");
    }
    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project Not Found");
    }
    const projectMember = await ProjectMember.findOneAndUpdate(
        {
            user: new mongoose.Types.ObjectId(user._id),
            project: new mongoose.Types.ObjectId(project._id),
        },
        {
            user: new mongoose.Types.ObjectId(user._id),
            project: new mongoose.Types.ObjectId(project._id),
            role: role,
        },
        {
            new: true,
            upsert: true,
        },
    );
    if (!projectMember) {
        throw new ApiError(404, "projectMember Not Found");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, {}, "Member added Successfully"));
});

const getProjectMembers = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project Not Found");
    }

    const projectMembers = await ProjectMember.aggregate([
        {
            $match: {
                project: new mongoose.Types.ObjectId(projectId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                user: {
                    $arrayElemAt: ["$user", 0],
                },
            },
        },
        {
            $project: {
                project: 1,
                user: 1,
                role: 1,
                createdAt: 1,
                updatedAt: 1,
                _id: 0,
            },
        },
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, projectMembers, "Project members fetched"));
});

const updateMemberRole = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.params;
    const { newRole } = req.body;
    if (!AvailableUserRole.includes(newRole)) {
        throw new ApiError(400, "Invalid Role");
    }

    let projectMember = await ProjectMember.findOne({
        user: new mongoose.Types.ObjectId(userId),
        project: new mongoose.Types.ObjectId(projectId),
    });
    if (!projectMember) {
        throw new ApiError(404, "ProjectMember not found");
    }

    projectMember = await ProjectMember.findByIdAndUpdate(
        projectMember._id,
        {
            role: newRole,
        },
        {
            new: true,
        },
    );
    if (!projectMember) {
        throw new ApiError(404, "ProjectMember not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, projectMember, "Project member role updated."),
        );
});

const deleteMember = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.params;

    let projectMember = await ProjectMember.findOne({
        user: new mongoose.Types.ObjectId(userId),
        project: new mongoose.Types.ObjectId(projectId),
    });

    if (!projectMember) {
        throw new ApiError(404, "ProjectMember not found");
    }

    projectMember = await ProjectMember.findByIdAndDelete(projectMember._id);

    if (!projectMember) {
        throw new ApiError(404, "ProjectMember not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, projectMember, "Project member deleted."));
});

export {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    addMembersToProject,
    getProjectMembers,
    updateMemberRole,
    deleteMember,
};
