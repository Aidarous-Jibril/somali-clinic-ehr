import { Router } from "express";
import * as controller from "./referral.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createReferralSchema,
  updateReferralStatusSchema,
} from "./referral.schema.js";

import { requireRoles } from "../../middlewares/roles.middleware.js";
import { Roles } from "../../constants/roles.js";

const router = Router();

router.post( "/", requireRoles(Roles.Doctor), validate(createReferralSchema), controller.createReferral );

router.get( "/patient/:patientId", requireRoles( Roles.Doctor, Roles.Nurse ), controller.listByPatient );

router.patch( "/:id/status", requireRoles( Roles.Doctor, Roles.Nurse ), validate(updateReferralStatusSchema), controller.updateStatus );

router.get( "/incoming", requireRoles( Roles.Doctor, Roles.Nurse ), controller.listIncoming );

router.get( "/outgoing", requireRoles( Roles.Doctor, Roles.Nurse ), controller.listOutgoing);

export default router;