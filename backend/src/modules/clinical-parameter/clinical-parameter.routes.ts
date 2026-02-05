import { Router } from "express";
import * as controller from "./clinical-parameter.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createClinicalParameterSchema } from "./clinical-parameter.schema.js";

const router = Router();

router.post( "/", validate(createClinicalParameterSchema), controller.createClinicalParameter);
router.get( "/encounter/:encounterId", controller.listClinicalParameters);

export default router;
