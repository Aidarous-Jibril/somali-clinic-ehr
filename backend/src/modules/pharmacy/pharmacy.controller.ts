import { Request, Response } from "express";
import * as service from "./pharmacy.service.js";

export const getWorklist =async ( req: Request, res: Response) => {
  try {
    const worklist = await service.getWorklist(req.user!);

    return res.json(worklist);
  } catch (error: any) {
    console.error(error);

    return res.status(error?.statusCode || 500).json({
      message: error.message,
    });
  }
};

export const startDispensing = async ( req: Request, res: Response) => {
  try {
    const medicationId = String(req.params.medicationId);

    const result = await service.startDispensing(
      medicationId,
      req.user!
    );

    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const dispenseMedication = async ( req: Request, res: Response) => {
  try {
    const medicationId = String(req.params.medicationId);

    const result = await service.dispenseMedication(
      medicationId,
      req.body,
      req.user!
    );

    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const cancelDispensing = async ( req: Request, res: Response ) => {
  try {
    const medicationId = String(req.params.medicationId);

    const result = await service.cancelDispensing(
      medicationId,
      req.body.notes,
      req.user!
    );

    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message, });
  }
};

export const listInventory = async ( req: Request, res: Response ) => {
  try {
    const inventory = await service.listInventory(req.user!);

    res.json(inventory);
  } catch (error: any) {
    res.status(error?.statusCode || 500).json({
      message: error?.message || "Failed to fetch inventory",
    });
  }
};

export const createInventory = async ( req: Request, res: Response ) => {
  try {
    const inventory = await service.createInventory( req.body, req.user!);

    res.status(201).json(inventory);
  } catch (err: any) {
    res.status(400).json({ message: err.message, });
  }
};

export const getInventoryById = async (req: Request, res: Response) => {
  try {
    const inventory = await service.getIventoryById(String(req.params.id), req.user!)

    return res.json(inventory)
  } catch (error: any) {
    return res.status(400).json({message: error.message})
  }
}

export const updateInventory = async ( req: Request, res: Response ) => {
  try {
    const inventory = await service.updateInventory( String(req.params.id), req.body, req.user!);

    return res.json(inventory);
  } catch (err: any) {
    return res.status(400).json({ message: err.message, });
  }
};

export const getLowStock = async ( req: Request, res: Response ) => {
  try {
    const inventory = await service.getLowStock(req.user!);

    return res.json(inventory);
  } catch (err: any) {
    return res.status(400).json({ message: err.message, });
  }
};

export const getExpiringInventory = async ( req: Request, res: Response ) => {
  try {
    const inventory = await service.getExpiringInventory(req.user!);

    return res.json(inventory);
  } catch (err: any) {
    return res.status(400).json({ message: err.message, });
  }
};


/**
 * Create Purchase
 */
export const createPurchase = async (req: Request, res: Response ) => {
  try {
    const purchase = await service.createPurchase(req.body, req.user!)
    return res.status(201).json(purchase);
  } catch (error: any) {
   return res.status(400).json({message: error.message,}) 
  }
  
}

export const listPurchases = async ( req: Request, res: Response ) => {
  try {
    const purchases = await service.listPurchases(req.user!);

    return res.json(purchases);
  } catch (err: any) {
    return res.status(400).json({ message: err.message, });
  }
};

export const getPurchase = async ( req: Request, res: Response ) => {
  try {
    const purchase = await service.getPurchase( String(req.params.id), req.user! );

    return res.json(purchase);
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const updatePurchase = async (req: Request, res: Response) => {
  try {
    const purchase = await service.updatePurchase(
      String(req.params.id),
      req.body,
      req.user!
    );

    return res.json(purchase);
  } catch (err: any) {
    return res.status(400).json({ message: err.message, });
  }
};

export const deletePurchase = async ( req: Request, res: Response ) => {
  console.log("ID", req.params.id)
  try {
    await service.deletePurchase( String(req.params.id), req.user! );

    return res.json({ message: "Purchase deleted successfully", });
  } catch (err: any) {
    return res.status(400).json({ message: err.message, });
  }
};

export const receivePurchase = async ( req: Request, res: Response ) => {
  try {
    const purchase = await service.receivePurchase( String(req.params.id), req.user! );

    return res.json(purchase);
  } catch (err: any) {
    return res.status(400).json({ message: err.message, });
  }
};


/**
 * Pharmacy dashboard
 */
export const getDashboard = async ( req: Request, res: Response ) => {
  try {
    const dashboard = await service.getDashboard(req.user);

    res.json(dashboard);
  } catch (error: any) {
    res.status(400).json({ message: error.message, });
  }
};
/**
 * Dispensing Report
 */
export const getDispensingReport = async ( req: Request, res: Response ) => {
  try {
    const report = await service.getDispensingReport( req.user, req.query );

    res.json(report);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Inventory Report
export const getInventoryReport = async ( req: Request, res: Response ) => {
  try {
    const report = await service.getInventoryReport( req.user, req.query );

    res.json(report);
  } catch (error: any) {
    res.status(400).json({ message: error.message, });
  }
};

// Purcahse Report
export const getPurchaseReport = async ( req: Request, res: Response ) => {
  try {
    const report = await service.getPurchaseReport( req.user!, req.query );

    res.json(report);
  } catch (error: any) { res.status(400).json({ message: error.message,  });
  }
};

// Adjust Inventory
export const adjustInventory = async (req: Request, res: Response) => {
  try {
    const inventory = await service.adjustInventory(
      String(req.params.id),
      req.body,
      req.user
    );

    res.status(200).json(inventory);
  } catch (error: any) {
    res.status(400).json({message: error.message, });
  }
};

// Expire Inventory
export const expireInventory = async ( req: Request, res: Response ) => {
  try {
    const inventory = await service.expireInventory(
      String(req.params.id),
      req.body,
      req.user
    );

    res.json(inventory);
  } catch (error: any) {
    res.status(400).json({ message: error.message, });
  }
};

// Damage Inventory
export const damageInventory = async ( req: Request, res: Response ) => {
  try {
    const inventory = await service.damageInventory(
      String(req.params.id),
      req.body,
      req.user
    );

    res.json(inventory);
  } catch (error: any) {
    res.status(400).json({ message: error.message, });
  }
};

// Return Inventory
export const returnInventory = async ( req: Request, res: Response ) => {
  try {
    const inventory = await service.returnInventory(
      String(req.params.id),
      req.body,
      req.user
    );

    res.json(inventory);
  } catch (error: any) {
    res.status(400).json({ message: error.message, });
  }
};

// Transfer Inventory
export const transferInventory = async ( req: Request, res: Response ) => {
  try {
    const inventory = await service.transferInventory(
      String(req.params.id),
      req.body,
      req.user
    );

    res.json(inventory);
  } catch (error: any) {
    res.status(400).json({ message: error.message, });
  }
};