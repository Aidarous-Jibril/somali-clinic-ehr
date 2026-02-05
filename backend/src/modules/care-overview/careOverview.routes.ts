import { Router } from "express";
import { getCareOverviewByPatient } from "./careOverview.controller.js";

const router = Router();

router.get("/patient/:patientId", getCareOverviewByPatient);

export default router;
