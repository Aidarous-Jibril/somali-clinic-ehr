import { Router } from "express";
import * as controller from "./sampling.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";

import {
  createSampleSchema,
  collectSampleSchema,
  rejectSampleSchema,
} from "./sampling.schema.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";
import { Roles } from "../../constants/roles.js";

const router = Router();

/* =========================
   CREATE
========================= */
router.post( "/", requireRoles("Lab", "Radiology"), validate(createSampleSchema), controller.createSampleController );

/* =========================
   GETTERS
========================= */
router.get( "/", controller.getAllSamplesController );
router.get( "/:id", controller.getSampleByIdController );
router.get( "/order/:orderId", controller.getSamplesByOrderIdController );

/* =========================
   LIFECYCLE
========================= */
// registered → collected
router.post( "/:id/collect", requireRoles(Roles.Lab, Roles.Nurse), validate(collectSampleSchema), controller.collectSampleController );

// collected → received
router.post( "/:id/receive", requireRoles(Roles.Lab, Roles.Radiology ), controller.receiveSampleController );

// received → processing
router.post( "/:id/process", requireRoles(Roles.Lab, Roles.Radiology ), controller.processSampleController );

// processing → completed
router.post( "/:id/complete", requireRoles(Roles.Lab, Roles.Radiology ), controller.completeSampleController );

// any → rejected
router.post( "/:id/reject", requireRoles(Roles.Lab, Roles.Radiology ), validate(rejectSampleSchema), controller.rejectSampleController);

export default router;