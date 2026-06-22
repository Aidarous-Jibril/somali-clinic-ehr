import { Router } from "express";
import * as controller from "./order.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createOrderSchema, resultOrderSchema, updateOrderSchema } from "./order.schema.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";
import { Roles } from "../../constants/roles.js";

const router = Router();


router.post( "/", requireRoles(Roles.Doctor), validate(createOrderSchema), controller.createOrder);


router.post("/:id/start",  requireRoles(Roles.Lab, Roles.Radiology), controller.startOrder);   // ordered → in_progress
router.post( "/:id/result", requireRoles(Roles.Lab, Roles.Radiology), validate(resultOrderSchema), controller.resultOrder);
router.post("/:id/review", requireRoles(Roles.Doctor), controller.reviewOrder);     // resulted → reviewed
router.post("/:id/complete", requireRoles(Roles.Doctor), controller.completeOrder); // reviewed → completed

router.get("/encounter/:encounterId", controller.listOrdersByEncounter);
router.get("/patient/:patientId", controller.listOrdersByPatient);

router.get( "/lab/worklist", requireRoles(Roles.Lab, Roles.Radiology), controller.listLabOrders );
router.patch("/:id", requireRoles(Roles.Doctor), validate(updateOrderSchema), controller.updateOrder);

export default router;
