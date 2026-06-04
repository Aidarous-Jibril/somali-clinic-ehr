// backend/src/modules/medication/nutrition-product/nutrition-product.controller.ts

import { Request, Response } from "express";
import * as service from "./nutrition-product.service.js";

export const createNutritionProduct = async ( req: Request, res: Response ) => {
  try {
    const item = await service.createNutritionProduct( req.body);
  
      res.status(201).json({
          message: "Nutrition product registered successfully",
          data: item,
      });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Failed to create nutrition product", });
  }
  };


export const listNutritionProducts = async ( req: Request, res: Response ) => {
  try {
    const patientId = String(req.params.patientId);
  
    const items = await service.listNutritionProducts(patientId);
  
    res.json(items);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Failed to load nutrition products",});
  }
};

export const updateNutritionProduct = async ( req: Request,res: Response ) => {
  try {
    const id = String(req.params.id);
  
    const item = await service.updateNutritionProduct( id, req.body);
  
    res.json(item);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Failed to update nutrition product",});
  }
};

export const deleteNutritionProduct = async ( req: Request, res: Response ) => {
  try {
    const id = String(req.params.id);
  
    await service.deleteNutritionProduct(id);
  
    res.status(204).send();
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Failed to delete nutrition product", });
  }
};