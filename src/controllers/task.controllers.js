import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";
import { Subtask } from "../models/subtask.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import mongoose from "mongoose";
import {
    AvailableTaskStatus,
    AvailableUserRole,
    TaskStatusEnum,
    UserRolesEnum,
} from "../utils/constants.js";

const getTasks = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project Not Found");
    }

    const tasks = await Task.find({
        project: project._id,
    }).populate("assginedTo", "avatar username fullName");

    return res
        .status(200)
        .json(new ApiResponse(200, tasks, "Task Fetched Successfully"));
});

const createTask = asyncHandler(async (req, res) => {
    const { title, description, assignedTo, status } = req.body;
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project Not Found");
    }

    const files = req.files || [];

    const attachments = files.map((file) => {
        return {
            url: `${process.env.SERVER_URL}/images/${file.originalname}`,
            mimetype: file.mimetype,
            size: file.size,
        };
    });

    const task = await Task.create({
        title,
        description,
        project: project._id,
        assignedTo: assignedTo,
        status,
        assignedBy: req.user._id,
        attachments,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, task, "Task Created Successfully"));
});

const getTaskById = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const task = await Task.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(taskId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "assignedTo",
                foreignField: "_id",
                as: "assignedTo",
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
            $lookup: {
                from: "subtasks",
                localField: "_id",
                foreignField: "task",
                as: "subtask",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "createdBy",
                            foreignField: "_id",
                            as: "createdBy",
                            pipeline: [
                                {
                                    $project: {
                                        _id: 1,
                                        username: 1,
                                        fullName: 1,
                                        avatar: 1,
                                    },
                                },
                                {
                                    $addFields: {
                                        createdBy: {
                                            $arrayElemAt: ["$createdBy", 0],
                                        },
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                assignedTo: {
                    $arrayElemAt: ["$assignedTo", 0],
                },
            },
        },
    ]);

    if (!task || task.length === 0) {
        throw new ApiError(404, "Task not Found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, task, "Task Fetched Successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
    
});

const deleteTask = asyncHandler(async (req, res) => {});

const createsubtask = asyncHandler(async (req, res) => {});

const updatesubtask = asyncHandler(async (req, res) => {});

const deletesubtask = asyncHandler(async (req, res) => {});

export {
    getTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    createsubtask,
    updatesubtask,
    deletesubtask,
};
