//dashboard/nurse/index.ts
import { Router } from "express";
import * as controller from "./nurse.controller.js";
import { requireRoles } from "../../../middlewares/roles.middleware.js";
import { Roles } from "../../../constants/roles.js";

const router = Router();

router.use(requireRoles(Roles.Nurse, Roles.Doctor));

router.get("/assigned-patients", controller.getNurseAssignedPatients);
router.get("/medication-due", controller.getNurseMedicationDueNow);
router.get("/vitals-overdue", controller.getNurseVitalsOverdue);
router.get("/fluid-alerts", controller.getNurseFluidAlerts);
router.get("/pending-referrals", controller.getNursePendingReferrals);
router.get("/ward-occupancy", controller.getNurseWardOccupancy);

export default router;