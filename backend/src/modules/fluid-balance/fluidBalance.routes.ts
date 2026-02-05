// fluidBalance.routes.ts
import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { createFluidBalanceSchema } from "./fluidBalance.schema.js";
import * as controller from "./fluidBalance.controller.js";

const router = Router();

router.post("/", validate(createFluidBalanceSchema), controller.createFluidBalance);
router.get("/patient/:patientId", controller.getByPatient);

export default router;
