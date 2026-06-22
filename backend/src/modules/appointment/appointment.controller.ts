import { Request, Response } from "express";
import * as service from "./appointment.service.js";
import { prisma } from "../../config/prisma.js";

const mapAppointment = (a: any) => ({
  id: a.id,
  scheduledAt: a.scheduledAt,
  status: a.status,
  encounterId: a.encounterId,

  patient: a.patient,

  doctor: {
    id: a.doctorAssignment?.id,
    name: `${a.doctorAssignment?.account?.person?.firstName} ${a.doctorAssignment?.account?.person?.lastName}`,
  },
});

// CREATE
export const createAppointment = async (req: Request, res: Response) => {

  const { patientId, doctorAssignmentId, unitId } = req.body;

  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
  });

  if (!patient || patient.clinicId !== req.user!.clinicId)
    return res.status(400).json({ message: "Invalid patient" });

  const assignment = await prisma.staffAssignment.findUnique({
    where: { id: doctorAssignmentId },
    include: { account: true },
  });

  if (!assignment || assignment.account.clinicId !== req.user!.clinicId)
    return res.status(400).json({ message: "Invalid doctor" });

  const unit = await prisma.unit.findUnique({ where: { id: unitId } });

  if (!unit || unit.clinicId !== req.user!.clinicId)
    return res.status(400).json({ message: "Invalid unit" });

  const appointment = await service.createAppointment({ ...req.body, clinicId: req.user!.clinicId,});

  res.status(201).json(mapAppointment(appointment)); 
};

// LIST
export const listAppointments = async (req: Request, res: Response) => {

  const data = await service.listAppointments({
    ...req.query,
    clinicId: req.user!.clinicId,
  });

  res.json(data.map(mapAppointment));
};

// ARRIVED
export const arrivedAppointment = async (req: Request, res: Response) => {
  const id = String(req.params.id);

  const appointment = await prisma.appointment.findUnique({ where: { id } });

  if (!appointment) 
    return res.status(404).json({ message: "Not found" });

  if (appointment.clinicId !== req.user!.clinicId)
    return res.status(403).json({ message: "Forbidden" });

  if (appointment.status !== "booked")
    return res.status(400).json({ message: "Must be booked first" });

  const updated = await service.markArrived(id);
  res.json(mapAppointment(updated)); 
};

// START
export const startAppointment = async (req: Request, res: Response) => {
  const id = String(req.params.id);

  const appointment = await prisma.appointment.findUnique({ where: { id } });

  if (!appointment) 
    return res.status(404).json({ message: "Not found" });

  if (appointment.clinicId !== req.user!.clinicId)
    return res.status(403).json({ message: "Forbidden" });

  if (appointment.status !== "arrived")
    return res.status(400).json({ message: "Patient must arrive first" });

  const updated = await service.startAppointment(id);
  res.json(mapAppointment(updated)); 
};

// COMPLETE
export const completeAppointment = async (req: Request, res: Response) => {
  const id = String(req.params.id);

  const appointment = await prisma.appointment.findUnique({ where: { id } });

  if (!appointment) 
    return res.status(404).json({ message: "Not found" });

  if (appointment.clinicId !== req.user!.clinicId)
    return res.status(403).json({ message: "Forbidden" });

  if (appointment.status !== "in_progress")
    return res.status(400).json({ message: "Must be in progress" });

  const updated = await service.completeAppointment(id);
  res.json(mapAppointment(updated)); 
};

// CANCEL
export const cancelAppointment = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const updated = await service.cancelAppointment(id, req.user!);
    res.json(mapAppointment(updated)); 
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// TODAY (optional simplified)
export const getTodayAppointments = async (req: Request, res: Response) => {

  const data = await service.getTodayAppointments(req.user!, req.query);

  res.json(data.map(mapAppointment)); 
};