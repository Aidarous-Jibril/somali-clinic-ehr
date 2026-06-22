import { Router } from "express";
import * as controller from "./patient.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createPatientSchema, updatePatientSchema, } from "./patient.schema.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";
import { Roles } from "../../constants/roles.js";

const router = Router();

router.post( "/", requireRoles( Roles.SuperAdmin, Roles.ClinicAdmin, Roles.Doctor, Roles.Nurse ), validate(createPatientSchema), controller.createPatient );

router.get( "/search", requireRoles( Roles.SuperAdmin, Roles.ClinicAdmin, Roles.Doctor, Roles.Nurse, Roles.Lab ), controller.searchPatients );

router.get( "/", requireRoles( Roles.SuperAdmin, Roles.ClinicAdmin, Roles.Doctor, Roles.Nurse, Roles.Lab ), controller.listMyClinicPatients );

router.get( "/:patientId", requireRoles( Roles.SuperAdmin, Roles.ClinicAdmin, Roles.Doctor, Roles.Nurse, Roles.Lab ), controller.getPatient );

router.patch( "/:patientId", requireRoles( Roles.SuperAdmin, Roles.ClinicAdmin, Roles.Doctor, Roles.Nurse ), validate(updatePatientSchema), controller.updatePatient );

router.delete( "/:patientId", requireRoles( Roles.SuperAdmin, Roles.ClinicAdmin ), controller.deletePatient );

export default router;