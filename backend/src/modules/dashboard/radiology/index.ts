//modules/dashboard/radiology/index.ts
import { Router } from "express";

import * as controller from "./radiology.controller.js";
import { Roles } from "../../../constants/roles.js";
import { requireRoles } from "../../../middlewares/roles.middleware.js";

const router = Router();

router.get( "/worklist", requireRoles(Roles.Radiology), controller.getRadiologyWorklist );

export default router;