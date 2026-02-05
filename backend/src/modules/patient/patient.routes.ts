import { Router } from "express";
import * as controller from "./patient.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createPatientSchema } from "./patient.schema.js";

const router = Router();

router.post("/", validate(createPatientSchema), controller.createPatient);
router.get("/:clinicId", controller.listPatients);

export default router;
