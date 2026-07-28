//radiology.routes.ts
import { Router } from "express";
import * as controller from "./radiology.controller.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";
import { Roles } from "../../constants/roles.js";
import { uploadRadiologyImages } from "../../middlewares/upload.middleware.js";

const router = Router();


// Radiology Worklist
// router.get( "/worklist", requireRoles(Roles.Radiology), controller.getRadiologyWorklistController );
router.post( "/orders/:id/report", requireRoles(Roles.Radiology), uploadRadiologyImages.array("images", 10), controller.submitRadiologyReportController );
router.get( "/patient/:patientId", requireRoles( Roles.Doctor, Roles.Nurse, Roles.Lab, Roles.Radiology ), controller.listRadiologyResultsByPatientController );

export default router;