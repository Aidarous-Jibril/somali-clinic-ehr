import { Router } from "express";
import * as controller from "./unit.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createUnitSchema } from "./unit.schema.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";
import { Roles } from "../../constants/roles.js";

const router = Router();

router.use(authMiddleware);

router.post( "/",requireRoles( Roles.SuperAdmin, Roles.ClinicAdmin ), validate(createUnitSchema), controller.createUnit);

router.get( "/clinic/:clinicId", controller.listByClinic );

router.get( "/", controller.listUnitsByClinic );

export default router;