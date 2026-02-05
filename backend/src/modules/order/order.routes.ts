import { Router } from "express";
import * as controller from "./order.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createOrderSchema } from "./order.schema.js";

const router = Router();

router.post("/", validate(createOrderSchema), controller.createOrder);
router.get("/encounter/:encounterId", controller.listOrdersByEncounter);
router.get("/patient/:patientId", controller.listOrdersByPatient);

export default router;
