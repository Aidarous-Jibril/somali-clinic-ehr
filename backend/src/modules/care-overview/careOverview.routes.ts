import { Router } from "express";
import { getCareOverviewByPatient } from "./careOverview.controller.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";
import { Roles } from "../../constants/roles.js";

const router = Router();

router.get("/patient/:patientId", requireRoles(Roles.Doctor, Roles.Nurse), getCareOverviewByPatient);

export default router;
