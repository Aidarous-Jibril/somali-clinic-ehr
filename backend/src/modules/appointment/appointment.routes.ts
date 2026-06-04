import { Router } from "express";
import * as controller from "./appointment.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createAppointmentSchema } from "./appointment.schema.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";
import { Roles } from "../../constants/roles.js";

const router = Router();

router.post("/", requireRoles(Roles.Doctor, Roles.Nurse), validate(createAppointmentSchema), controller.createAppointment);

router.get("/today", requireRoles(Roles.Doctor, Roles.Nurse), controller.getTodayAppointments);

router.get("/", requireRoles(Roles.Doctor, Roles.Nurse), controller.listAppointments);

router.post("/:id/arrived", requireRoles( Roles.Nurse), controller.arrivedAppointment);
router.post("/:id/start", requireRoles(Roles.Doctor, ), controller.startAppointment);
router.post("/:id/complete", requireRoles(Roles.Doctor, ), controller.completeAppointment);
router.post("/:id/cancel", requireRoles(Roles.Doctor, Roles.Nurse), controller.cancelAppointment);

export default router;