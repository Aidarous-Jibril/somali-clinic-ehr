import { Router } from "express";
import * as controller from "./clinical-parameter.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createClinicalParameterSchema } from "./clinical-parameter.schema.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";
import { Roles } from "../../constants/roles.js";

const router = Router();

router.post( "/", requireRoles(Roles.Doctor, Roles.Nurse), validate(createClinicalParameterSchema), controller.createClinicalParameter);
router.get( "/encounter/:encounterId", requireRoles(Roles.Doctor, Roles.Nurse), controller.listClinicalParameters);

export default router;
