// backend/src/modules/medication/nutrition-product/nutrition-product.controller.ts

import { Request, Response } from "express";
import * as service from "./nutrition-product.service.js";

export const createNutritionProduct = async ( req: Request, res: Response ) => {
  try {
    const item = await service.createNutritionProduct( req.body, req.user);
  
      res.status(201).json({
          message: "Nutrition product registered successfully",
          data: item,
      });
  } catch (error: any) {
    console.error(error);

    res.status(400).json({ message: error.message, });
  }
  };


export const listNutritionProducts = async (req: Request, res: Response) => {
  try {
    const patientId = String(req.params.patientId);

    const items = await service.listNutritionProducts(patientId, req.user);

    res.json(items);
  } catch (error: any) {
    console.error(error);

    res.status(403).json({ message: error.message, });
  }
};

export const updateNutritionProduct = async ( req: Request, res: Response ) => {
  try {
    const id = String(req.params.id);

    const item = await service.updateNutritionProduct(id, req.body, req.user);

    res.json(item);
  } catch (error: any) {
      console.error(error);
      res.status(400).json({ message: error.message, });
  }
};

export const deleteNutritionProduct = async ( req: Request, res: Response ) => {
  try {
    const id = String(req.params.id);

    await service.deleteNutritionProduct(id, req.user);

    res.status(204).send();
  } catch (error: any) {
    console.error(error);
    const status = error.message.includes("own clinic") ? 403 : 400;
    res.status(status).json({ message: error.message });
  }
};