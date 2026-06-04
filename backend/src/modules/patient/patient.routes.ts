import { Router } from "express";
import * as controller from "./patient.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createPatientSchema } from "./patient.schema.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";
import { Roles } from "../../constants/roles.js";

const router = Router();

router.post("/", requireRoles(Roles.Doctor, Roles.Nurse,), validate(createPatientSchema), controller.createPatient);
router.get("/search", requireRoles(Roles.Doctor, Roles.Nurse, Roles.Lab), controller.searchPatients);
router.get("/", requireRoles(Roles.Doctor, Roles.Nurse, Roles.Lab), controller.listMyClinicPatients);
router.get("/:patientId", requireRoles(Roles.Doctor, Roles.Nurse, Roles.Lab), controller.getPatient);


export default router;
