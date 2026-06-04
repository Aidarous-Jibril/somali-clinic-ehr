import { Router } from "express";
import {
  getTeamsHandler,
  createTeamHandler,
} from "./team.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

import { Roles } from "../../constants/roles.js";
import { createTeamSchema } from "./team.schema.js";

const router = Router();

router.use(authMiddleware);

router.get( "/", getTeamsHandler );

router.post( "/", requireRoles( Roles.SuperAdmin, Roles.ClinicAdmin), validate(createTeamSchema),createTeamHandler);

export default router;