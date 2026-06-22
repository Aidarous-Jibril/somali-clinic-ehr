import { Request, Response } from "express";
import * as service from "./order.service.js";
import { prisma } from "../../config/prisma.js";

// CREATE
export const createOrder = async (req: Request, res: Response) => {
  const user = req.user!;

  const order = await service.createOrder({
    ...req.body,
    clinicId: user.clinicId,
    orderedByAccountId: user.accountId,
  });

  return res.status(201).json(order);
};

// UPDATE
export const updateOrder = async (req: Request, res: Response) => {
  const user = req.user!;
  const id = String(req.params.id);

  const existingOrder = await prisma.order.findUnique({
    where: { id },
  });

  if (!existingOrder) 
    return res.status(404).json({ message: "Order not found", });

  // same clinic check
  if (existingOrder.clinicId !== user.clinicId) 
    return res.status(403).json({ message: "Forbidden: different clinic", });

  // only creator can edit
  if (existingOrder.orderedByAccountId !== user.accountId) 
    return res.status(403).json({ message: "Only creator can edit", });

  const updated = await service.updateOrder(id, req.body);

  return res.json(updated);
};

// LIST
export const listOrdersByEncounter = async (req: Request, res: Response) => {
  const user = req.user!;

  const encounter = await prisma.encounter.findFirst({
    where: {
      id: String(req.params.encounterId),
      clinicId: user.clinicId,
    },
  });

  if (!encounter) return res.status(404).json({ message: "Encounter not found",});

  const orders = await service.listOrdersByEncounter( String(req.params.encounterId));
  return res.json(orders);
};

export const listOrdersByPatient = async (req: Request, res: Response) => {
  const orders = await service.listOrdersByPatient(
    String(req.params.patientId),
    req.user!.clinicId
  );

  return res.json(orders);
};

export const listLabOrders = async (req: Request, res: Response) => {
  const orders = await service.listLabOrders(req.user!.clinicId);
  return res.json(orders);
};

// ---------------------
// LIFECYCLE
// ---------------------

// ordered → in_progress
export const startOrder = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const user = req.user!;

  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order) 
    return res.status(404).json({ message: "Order not found", });

  // clinic isolation
  if (order.clinicId !== user.clinicId) 
    return res.status(403).json({ message: "Forbidden: different clinic", });

  if (order.status !== "ordered") 
    return res.status(400).json({ message: "Order must be ordered first", });

  const updated = await service.startOrder(id);
  return res.json(updated);
};

// in_progress → resulted
export const resultOrder = async (req: Request, res: Response) => {
  const result = await service.resultOrder(
    String(req.params.id),
    req.user!.clinicId,
    req.user!.accountId,
    req.body
  );

  return res.json(result);
};

// resulted → reviewed
export const reviewOrder = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const user = req.user!;

  const order = await prisma.order.findUnique({ where: { id }, });

  if (!order) 
    return res.status(404).json({ message: "Order not found",  });

  if (order.clinicId !== user.clinicId) 
    return res.status(403).json({ message: "Forbidden: different clinic", });

  if (order.status !== "resulted") 
    return res.status(400).json({ message: "Order must be resulted first", });

  const updated = await service.reviewOrder(id, user.accountId);
  return res.json(updated);
};

// reviewed → completed
export const completeOrder = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const user = req.user!;

  const order = await prisma.order.findUnique({ where: { id }, });

  if (!order) return res.status(404).json({ message: "Order not found",});

  if (order.clinicId !== user.clinicId) 
    return res.status(403).json({ message: "Forbidden: different clinic", });
  

  if (order.status !== "reviewed") 
    return res.status(400).json({ message: "Order must be reviewed first", });

  const updated = await service.completeOrder(id);
  return res.json(updated);
};