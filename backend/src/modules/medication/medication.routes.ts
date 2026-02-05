import { Router } from "express";
import * as controller from "./medication.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createMedicationSchema } from "./medication.schema.js";

const router = Router();

router.post("/", validate(createMedicationSchema), controller.createMedication);
router.get("/patient/:patientId", controller.listActiveMedications);

router.patch("/:id/stop", controller.stopMedication);
router.patch("/:id/pause", controller.pauseMedication);

export default router;
