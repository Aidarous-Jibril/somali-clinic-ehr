import { Request, Response } from "express";
import * as service from "./staff.service.js";

export const createStaff = async ( req: Request, res: Response ) => {
  try {
    const user = req.user;

    if (!user) return res.status(401).json({ message: "Unauthorized", });
    
    const staff = await service.createStaff( req.body, user);

    res.status(201).json(staff);
  } catch (error: any) {
    res.status( error.message === "Forbidden" ? 403 : 500 ).json({ message: error.message || "Failed to create staff",});
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await service.login(email, password);

    res.json(result);
  } catch (err: any) {
    res.status(401).json({
      message: err.message,
    });
  }
};

export const listStaff = async (req: Request, res: Response) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const data = await service.listStaff(user.clinicId);
  const result = data.map((a: any) => ({
  id: a.assignments[0]?.id, 
  accountId: a.id,
  name: `${a.person.firstName} ${a.person.lastName}`,
  email: a.email,
  role: a.assignments[0]?.role ?? null,

  unitId: a.assignments[0]?.unitId ?? null,
  unitName: a.assignments[0]?.unit?.name ?? null,

  teamId: a.assignments[0]?.teamId ?? null,
  teamName: a.assignments[0]?.team?.name ?? null,
}));
  res.json(result);
};

export const listByUnit = async (req: Request, res: Response) => {
  const unitId = String(req.params.unitId);

  const data = await service.listByUnit(unitId);

  const result = data.map((x: any) => ({
    id: x.account.id,
    name: `${x.account.person.firstName} ${x.account.person.lastName}`,
    email: x.account.email,
    role: x.role,
    unitId: x.unitId,
    unitName: x.unit?.name ?? null,
  }));

  res.json(result);
};