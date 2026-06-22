import { Router } from "express";
import * as controller from "./consent.controller.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";
import { Roles } from "../../constants/roles.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createConsentSchema, updateConsentStatusSchema } from "./consent.schema.js";

const router = Router();

router.get("/patient/:patientId",  requireRoles(Roles.SuperAdmin, Roles.Doctor, Roles.Nurse), controller.getByPatient);
router.post("/", requireRoles(Roles.SuperAdmin, Roles.Doctor, Roles.Nurse), validate(createConsentSchema), controller.create);
router.patch("/:id/status", requireRoles(Roles.SuperAdmin, Roles.Doctor, Roles.Nurse), validate(updateConsentStatusSchema), controller.updateStatus);
router.delete( "/:id", requireRoles(Roles.SuperAdmin, Roles.ClinicAdmin, Roles.Doctor), controller.remove );

export default router;