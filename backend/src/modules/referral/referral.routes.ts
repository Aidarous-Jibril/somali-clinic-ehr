import { Router } from "express";
import * as controller from "./referral.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createReferralSchema,
  updateReferralStatusSchema,
} from "./referral.schema.js";

const router = Router();

router.post("/", validate(createReferralSchema), controller.createReferral);
router.get("/patient/:patientId", controller.listByPatient);
router.patch("/:id/status", validate(updateReferralStatusSchema), controller.updateStatus);

export default router;
