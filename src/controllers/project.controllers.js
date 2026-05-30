import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import { ProjectMember } from "../models/projectMember.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import mongoose from "mongoose";
import { UserRolesEnum } from "../utils/constants.js";

const getProjects = asyncHandler(async (req, res) => {});

const getProjectById = asyncHandler(async (req, res) => {});

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

const addMembersToProject = asyncHandler(async (req, res) => {});

const getProjectMembers = asyncHandler(async (req, res) => {});

const updateMemberRole = asyncHandler(async (req, res) => {});

const deleteMember = asyncHandler(async (req, res) => {});

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
