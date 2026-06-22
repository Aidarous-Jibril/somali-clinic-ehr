// backend/src/modules/nutrition-product/nutrition-product.routes.ts
import { Router } from "express";
import * as controller from "./nutrition-product.controller.js";
import { createNutritionProductSchema, updateNutritionProductSchema, } from "./nutrition-product.schema.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";
import { Roles } from "../../constants/roles.js";

const router = Router();

router.post( "/", requireRoles(Roles.Doctor, Roles.Nurse, Roles.SuperAdmin), validate(createNutritionProductSchema), controller.createNutritionProduct );

router.get( "/patient/:patientId", requireRoles(Roles.Doctor, Roles.Nurse, Roles.SuperAdmin), controller.listNutritionProducts );

router.patch( "/:id", requireRoles(Roles.Doctor, Roles.Nurse, Roles.SuperAdmin), validate(updateNutritionProductSchema), controller.updateNutritionProduct );

router.delete( "/:id", requireRoles(Roles.Doctor, Roles.SuperAdmin), controller.deleteNutritionProduct );

export default router;