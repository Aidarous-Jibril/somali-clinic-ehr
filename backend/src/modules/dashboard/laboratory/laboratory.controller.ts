// //dashboard/laboraroty/laboraroty.controller.ts
// import { Request, Response } from "express";

// import * as service from "./laboratory.service.js";

// export const getLaboratoryWorklist = async ( req: Request, res: Response ) => {
//   const user = req.user!;

//   if (!user.unitId) 
//     return res.status(403).json({ message: "User is not assigned to a laboratory unit", });

//   const orders = await service.getLaboratoryWorklist( user.clinicId, user.unitId);
//   console.log("LABS:", orders)
//   return res.json(orders);
// };

// modules/dashboard/laboratory/laboratory.controller.ts

import { Request, Response } from "express";

import * as service from "./laboratory.service.js";
import { toLaboratoryWorklistItem } from "./laboratory.mapper.js";

export const getLaboratoryWorklist = async (
  req: Request,
  res: Response
) => {
  try {
    const user = req.user!;

    if (!user.unitId) {
      return res.status(403).json({
        message: "User is not assigned to a laboratory unit",
      });
    }

    const orders = await service.getLaboratoryWorklist(
      user.clinicId,
      user.unitId
    );

    const mapped = orders.map(toLaboratoryWorklistItem);

    return res.json(mapped);
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};