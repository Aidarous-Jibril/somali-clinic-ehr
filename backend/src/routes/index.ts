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
import vaccinationRoutes from "../modules/vaccination/vaccination.routes.js";
import unitRoutes from "../modules/unit/unit.routes.js";
import staffRoutes from "../modules/staff/staff.routes.js";
import appointmentRoutes from "../modules/appointment/appointment.routes.js";
import journalRoutes from "../modules/journal/journal.routes.js";
import inpatientRoutes from "../modules/inpatient/inpatient.routes.js";
import teamRoutes from "../modules/team/team.routes.js";
import consentRoutes from "../modules/consent/consent.routes.js";
import medicationDoseRoutes from "../modules/medication-dose/medication-dose.routes.js";
import nutritionProductRoutes from "../modules/nutrition-product/nutrition-product.routes.js";
import samplesRoutes from "../modules/sampling/samples.routes.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
router.use("/inpatients", inpatientRoutes);

//
// 🔓 PUBLIC ROUTES
//
router.use("/staff", staffRoutes);
router.use("/clinics", clinicRoutes);
router.use("/units", unitRoutes);

//
// 🔒 EVERYTHING BELOW REQUIRES LOGIN
//
router.use(authMiddleware);

router.use("/patients", patientRoutes);
router.use("/encounters", encounterRoutes);
router.use("/clinical-parameters", clinicalParameterRoutes);
router.use("/orders", orderRoutes);
router.use("/lab-results", labResultRoutes);
router.use("/medications", medicationRoutes);
router.use("/referrals", referralRoutes);
router.use("/fluid-balance", fluidBalanceRoutes);
router.use("/care-overview", careOverviewRoutes);
router.use("/vaccinations", vaccinationRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/journal", journalRoutes);
router.use("/teams", teamRoutes);
router.use("/consents", consentRoutes);
router.use("/", medicationDoseRoutes);
router.use("/nutrition-products", nutritionProductRoutes);
router.use("/samples", samplesRoutes);

export default router;
