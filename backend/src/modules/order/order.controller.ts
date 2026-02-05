import { Request, Response } from "express";
import * as service from "./order.service.js";

export const createOrder = async (req: Request, res: Response) => {
  const order = await service.createOrder(req.body);
  res.status(201).json(order);
};

export const listOrdersByEncounter = async (req: Request, res: Response) => {
  const encounterId = req.params.encounterId as string;
  const orders = await service.listOrdersByEncounter(encounterId);
  res.json(orders);
};

export const listOrdersByPatient = async (req: Request, res: Response) => {
  const patientId = req.params.patientId as string;
  const orders = await service.listOrdersByPatient(patientId);
  res.json(orders);
};

