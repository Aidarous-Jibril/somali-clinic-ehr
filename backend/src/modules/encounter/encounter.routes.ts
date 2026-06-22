import { Router } from "express";
import * as controller from "./encounter.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createEncounterSchema } from "./encounter.schema.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";
import { Roles } from "../../constants/roles.js";

const router = Router();

router.post( "/", requireRoles(Roles.Doctor, Roles.Nurse, ), validate(createEncounterSchema), controller.createEncounter);
router.get( "/patient/:patientId", requireRoles(Roles.SuperAdmin, Roles.Doctor, Roles.ClinicAdmin, Roles.Nurse, Roles.Lab), controller.listEncountersByPatient );
router.get("/active/:patientId", requireRoles(Roles.SuperAdmin,Roles.ClinicAdmin, Roles.Doctor, Roles.Nurse, Roles.Lab), controller.getActiveEncounter);
router.patch("/:encounterId/close", requireRoles(Roles.SuperAdmin, Roles.ClinicAdmin,  Roles.Doctor,), controller.closeEncounter);
export default router;
