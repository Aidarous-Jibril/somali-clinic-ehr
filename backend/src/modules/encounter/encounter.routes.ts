import { Router } from "express";
import * as controller from "./encounter.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createEncounterSchema } from "./encounter.schema.js";

const router = Router();

// Create encounter
router.post( "/", validate(createEncounterSchema), controller.createEncounter);
// List encounters for patient
router.get( "/patient/:patientId", controller.listEncountersByPatient );
// Close encounter
router.post( "/:encounterId/close", controller.closeEncounter);

export default router;
