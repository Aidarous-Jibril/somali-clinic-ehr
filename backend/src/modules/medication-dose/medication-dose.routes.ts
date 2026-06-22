import { Router } from "express";
import * as controller from "./medication-dose.controller.js";
import {
  administerDoseSchema,
  createMedicationDoseSchema,
  skipDoseSchema,
} from "./medication-dose.schema.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";
import { Roles } from "../../constants/roles.js";

const router = Router();

router.post( "/medications/:id/doses", requireRoles(Roles.Doctor, Roles.Nurse), validate(createMedicationDoseSchema), controller.createDose );

router.get( "/medications/:id/administrations", requireRoles(Roles.Doctor, Roles.Nurse), controller.listAdministrations );

router.patch( "/medication-doses/:doseId/prepare", requireRoles(Roles.Nurse), controller.prepareDose );

router.patch( "/medication-doses/:doseId/administer", requireRoles(Roles.Nurse), validate(administerDoseSchema), controller.administerDose);

router.patch( "/medication-doses/:doseId/self-administer", requireRoles(Roles.Nurse), controller.selfAdministerDose );

router.patch( "/medication-doses/:doseId/skip", requireRoles(Roles.Nurse), validate(skipDoseSchema), controller.skipDose );

export default router;