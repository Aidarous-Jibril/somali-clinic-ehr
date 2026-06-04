import { Router } from "express";
import * as controller from "./staff.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createStaffSchema } from "./staff.schema.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";
import { Roles } from "../../constants/roles.js";

const router = Router();

router.post("/login", controller.login);
router.post( "/", authMiddleware, requireRoles( Roles.SuperAdmin, Roles.ClinicAdmin ), validate(createStaffSchema), controller.createStaff);

// 🔐 PROTECTED ROUTES
router.use(authMiddleware);

router.get( "/", requireRoles( Roles.SuperAdmin, Roles.ClinicAdmin ), controller.listStaff );
router.get( "/unit/:unitId", requireRoles( Roles.SuperAdmin, Roles.ClinicAdmin, Roles.Doctor, Roles.Nurse ), controller.listByUnit );

export default router;
