import { Router } from "express";
import * as controller from "./labResult.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createLabResultSchema } from "./labResult.schema.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";
import { Roles } from "../../constants/roles.js";

const router = Router();

router.post( "/", requireRoles( Roles.Lab, Roles.Radiology ), validate(createLabResultSchema), controller.createLabResult );
router.get(
  "/patient/:patientId",
  requireRoles(
    Roles.Doctor,
    Roles.Nurse,
    Roles.Lab,
    Roles.Radiology
  ),
  controller.listResultsByPatient
);

export default router;

