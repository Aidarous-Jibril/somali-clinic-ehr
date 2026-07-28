//dashboard/laboraroty/index.ts
import { Router } from "express";

import * as controller from "./laboratory.controller.js";
import { requireRoles } from "../../../middlewares/roles.middleware.js";
import { Roles } from "../../../constants/roles.js";

const router = Router();

router.get( "/worklist", requireRoles(Roles.Lab), controller.getLaboratoryWorklist);


export default router;