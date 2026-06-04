import { Request, Response } from "express";
import * as service from "./order.service.js";
import { prisma } from "../../config/prisma.js";

// CREATE
export const createOrder = async (req: Request, res: Response) => {
  const user = (req as any).user;

  const order = await service.createOrder({
    ...req.body,
    clinicId: user.clinicId,
    orderedByAccountId: user.accountId,
  });
  return res.status(201).json(order);
};

// UPDATE
export const updateOrder = async (req: Request, res: Response) => {
  const user = (req as any).user;

  const id = String(req.params.id);

  const existingOrder = await prisma.order.findUnique({ where: { id } });
  if (!existingOrder) return res.status(404).json({ message: "Order not found" });

  if (existingOrder.orderedByAccountId !== user.accountId) return res.status(403).json({ message: "Only creator can edit" });

  const updated = await service.updateOrder(id, req.body);
  res.json(updated);
};

// LIST
export const listOrdersByEncounter = async (req: Request, res: Response) => {
  const orders = await service.listOrdersByEncounter(String(req.params.encounterId));
  res.json(orders);
};

export const listOrdersByPatient = async (req: Request, res: Response) => {
  const orders = await service.listOrdersByPatient(String(req.params.patientId));
  res.json(orders);
};

export const listLabOrders = async ( req: Request, res: Response ) => {
  const orders = await service.listLabOrders( req.user!.clinicId );

  res.json(orders);
};

// ---------------------
// LIFECYCLE
// ---------------------
export const startOrder = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const order = await prisma.order.findUnique({ where: { id } });

  if (!order) return res.status(404).json({ message: "Order not found" });

  if (order.status !== "ordered")
    return res.status(400).json({ message: "Order must be ordered first" });

  const updated = await service.startOrder(id);
  res.json(updated);
};


export const resultOrder = async ( req: Request, res: Response ) => {
  const result = await service.resultOrder(
    String(req.params.id),
    req.user!.accountId,
    req.body
  );

  return res.json(result);
};

export const reviewOrder = async (req: Request, res: Response) => {
  const user = (req as any).user;

  const id = String(req.params.id);
  const order = await prisma.order.findUnique({ where: { id } });

  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.status !== "resulted")
    return res.status(400).json({ message: "Order must be resulted first" });

  const updated = await service.reviewOrder(id, user.accountId);
  res.json(updated);
};

export const completeOrder = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const order = await prisma.order.findUnique({ where: { id } });

  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.status !== "reviewed")
    return res.status(400).json({ message: "Order must be reviewed first" });

  const updated = await service.completeOrder(id);
  res.json(updated);
};