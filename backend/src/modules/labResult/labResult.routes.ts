import { Router } from "express";
import * as controller from "./labResult.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createLabResultSchema } from "./labResult.schema.js";

const router = Router();

router.post("/", validate(createLabResultSchema), controller.createLabResult);
router.get("/patient/:patientId", controller.listResultsByPatient);

export default router;
