import { Router } from "express";
import * as controller from "./consent.controller.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";
import { Roles } from "../../constants/roles.js";

const router = Router();

router.get("/patient/:patientId",  requireRoles(Roles.Doctor, Roles.Nurse), controller.getByPatient);
router.post("/", requireRoles(Roles.Doctor, Roles.Nurse), controller.create);
router.patch("/:id/status", requireRoles(Roles.Doctor, Roles.Nurse), controller.updateStatus);

export default router;