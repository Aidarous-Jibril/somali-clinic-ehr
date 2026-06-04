import { requireRoles } from "../../middlewares/roles.middleware.js";
import { Roles } from "../../constants/roles.js";

import { Router } from "express";
import * as controller from "./medication.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createMedicationSchema } from "./medication.schema.js";

const router = Router();

router.post( "/", requireRoles(Roles.Doctor), validate(createMedicationSchema), controller.createMedication);

router.get( "/favorites", requireRoles( Roles.Doctor, Roles.Nurse ), controller.listFavorites );

router.get("/patient/:patientId", requireRoles( Roles.Doctor, Roles.Nurse ), controller.listMedications );

router.patch( "/:id/stop", requireRoles(Roles.Doctor),controller.stopMedication ); 

router.patch( "/:id/pause", requireRoles(Roles.Doctor), controller.pauseMedication );

router.patch( "/:id/resume", requireRoles(Roles.Doctor), controller.resumeMedication );

export default router;