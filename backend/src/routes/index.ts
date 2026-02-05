// src/routes/index.ts
import { Router } from "express";
import patientRoutes from "../modules/patient/patient.routes.js";
import clinicRoutes from "../modules/clinic/clinic.routes.js";
import encounterRoutes from "../modules/encounter/encounter.routes.js";
import clinicalParameterRoutes from "../modules/clinical-parameter/clinical-parameter.routes.js";
import orderRoutes from "../modules/order/order.routes.js";
import labResultRoutes from "../modules/labResult/labResult.routes.js";
import medicationRoutes from "../modules/medication/medication.routes.js";
import referralRoutes from "../modules/referral/referral.routes.js"; 
import fluidBalanceRoutes from "../modules/fluid-balance/fluidBalance.routes.js"; 
import careOverviewRoutes from "../modules/care-overview/careOverview.routes.js";


const router = Router();

router.use("/patients", patientRoutes);
router.use("/clinics", clinicRoutes);
router.use("/encounters", encounterRoutes);
router.use("/clinical-parameters", clinicalParameterRoutes);
router.use("/orders", orderRoutes);
router.use("/lab-results", labResultRoutes);
router.use("/medications", medicationRoutes);
router.use("/referrals", referralRoutes); 
router.use("/fluid-balance", fluidBalanceRoutes); 
router.use("/care-overview", careOverviewRoutes);

export default router;
