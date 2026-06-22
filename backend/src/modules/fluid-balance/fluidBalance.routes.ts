// fluidBalance.routes.ts
import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { createFluidBalanceSchema, updateFluidBalanceSchema } from "./fluidBalance.schema.js";
import * as controller from "./fluidBalance.controller.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";
import { Roles } from "../../constants/roles.js";

const router = Router();

router.post("/", requireRoles(Roles.Doctor, Roles.Nurse, Roles.SuperAdmin), validate(createFluidBalanceSchema), controller.createFluidBalance);
router.get("/patient/:patientId", requireRoles(Roles.Doctor, Roles.Nurse, Roles.SuperAdmin), controller.getByPatient);
router.put( "/:id", requireRoles(Roles.Doctor, Roles.Nurse, Roles.SuperAdmin), validate(updateFluidBalanceSchema), controller.updateFluidBalance );

export default router;
