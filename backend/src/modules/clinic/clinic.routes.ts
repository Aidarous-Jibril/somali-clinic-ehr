import { Router } from "express";
import * as controller from "./clinic.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";
import { Roles } from "../../constants/roles.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createClinicSchema } from "./clinic.schema.js";

const router = Router();

// PUBLIC (for login dropdown)
router.get("/public", controller.listClinics);

// PROTECTED
router.post( "/", authMiddleware, requireRoles(Roles.SuperAdmin), validate(createClinicSchema), controller.createClinic );

export default router;