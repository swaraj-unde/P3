import { Router } from "express";
import {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    addMembersToProject,
    getProjectMembers,
    updateMemberRole,
    deleteMember,
} from "../controllers/project.controllers.js";
import { validate } from "../middleware/validator.middleware.js";
import {
    addMemberToProjectValidator,
    createProjectValidator,
} from "../validators/index.js";
import {

    validateProjectPermissions,
    verifyJWT,
} from "../middleware/auth.middleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const router = Router();


router.use(verifyJWT);

router
    .route("/")
    .get(getProjects)
    .post(createProjectValidator(), validate, createProject);

router
    .route("/:projectId")
    .get(validateProjectPermissions(AvailableUserRole), getProjectById)
    .put(
        validateProjectPermissions([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_ADMIN,
        ]),
        updateProject,
    )
    .delete(validateProjectPermissions([UserRolesEnum.ADMIN]), deleteProject);

router
    .route("/:projectId/members")
    .get(getProjectMembers)
    .post(
        validateProjectPermissions([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_ADMIN,
        ]),
        addMemberToProjectValidator(),
        validate,
        addMembersToProject,
    );

router
    .route("/:projectId/members/:userId")
    .put(validateProjectPermissions([UserRolesEnum.ADMIN]), updateMemberRole)
    .delete(validateProjectPermissions([UserRolesEnum.ADMIN]), deleteMember);

export default router;
