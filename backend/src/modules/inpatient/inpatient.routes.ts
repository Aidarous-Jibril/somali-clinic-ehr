//backend/src/modules/inpatient/inpatient.routes.ts
import { Router } from "express";
import {
  getActiveContactsHandler,
  savePlannedDischargeHandler,
  changeBedHandler,
  getPatientLogHandler,
  getCoordinationHandler,
  saveCoordinationHandler,
  planTransferHandler,
  getTransfersHandler,
  reserveBedHandler,
  transferNowHandler,
  endCareContactHandler,
  admitPatientHandler
} from "./inpatient.controller.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";
import { Roles } from "../../constants/roles.js";

const router = Router();

router.get("/active", requireRoles(Roles.Doctor, Roles.Nurse), getActiveContactsHandler);
router.get("/:stayId/log", requireRoles(Roles.Doctor, Roles.Nurse), getPatientLogHandler);
router.get("/:stayId/coordination", requireRoles(Roles.Doctor, Roles.Nurse), getCoordinationHandler);

router.post("/admit",requireRoles(Roles.Doctor, Roles.Nurse), admitPatientHandler);
router.patch("/planned-discharge",requireRoles(Roles.Doctor, Roles.Nurse), savePlannedDischargeHandler);
router.patch("/change-bed", requireRoles(Roles.Doctor, Roles.Nurse), changeBedHandler);
router.put("/coordination", requireRoles(Roles.Doctor, Roles.Nurse), saveCoordinationHandler);
router.post("/plan-transfer", requireRoles(Roles.Doctor, ), planTransferHandler);
router.get("/transfers", requireRoles(Roles.Doctor, Roles.Nurse), getTransfersHandler);
router.patch("/transfers/reserve-bed", requireRoles(Roles.Doctor, Roles.Nurse), reserveBedHandler);
router.post("/transfers/transfer-now", requireRoles(Roles.Doctor, ), transferNowHandler);
router.patch("/end-care-contact", requireRoles(Roles.Doctor, ), endCareContactHandler);

export default router;
