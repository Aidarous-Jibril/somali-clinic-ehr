import { Router } from "express";
import * as controller from "./vaccination.controller.js";
import { createVaccinationSchema } from "./vaccination.schema.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";
import { Roles } from "../../constants/roles.js";

const router = Router();

router.post( "/", requireRoles( Roles.Doctor, Roles.Nurse ), validate(createVaccinationSchema), controller.createVaccination );

router.get( "/patient/:patientId", requireRoles( Roles.SuperAdmin, Roles.ClinicAdmin, Roles.Doctor, Roles.Nurse, Roles.Lab ), controller.listVaccinations );

router.patch( "/:id/decline", requireRoles( Roles.Doctor, Roles.Nurse ), controller.declineVaccination );

router.patch( "/:id/complete", requireRoles( Roles.Doctor, Roles.Nurse ), controller.completeVaccination );

export default router;