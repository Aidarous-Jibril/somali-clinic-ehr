import { Router } from "express";
import * as controller from "./pharmacy.controller.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";
import { Roles } from "../../constants/roles.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { adjustInventorySchema, cancelDispensingSchema, createInventorySchema, createPurchaseSchema, damageInventorySchema, dispenseMedicationSchema, expireInventorySchema, returnInventorySchema, startDispensingSchema, transferInventorySchema, updateInventorySchema, updatePurchaseSchema } from "./pharmacy.schema.js";

const router = Router();

router.get( "/worklist", requireRoles(Roles.Pharmacist, Roles.ClinicAdmin, Roles.SuperAdmin), controller.getWorklist );
router.get( "/inventory", requireRoles(Roles.Pharmacist, Roles.ClinicAdmin, Roles.SuperAdmin), controller.listInventory );
router.post( "/inventory", requireRoles(Roles.Pharmacist, Roles.ClinicAdmin, Roles.SuperAdmin), validate(createInventorySchema), controller.createInventory );
router.post( "/:medicationId/dispense", requireRoles(Roles.Pharmacist, Roles.ClinicAdmin, Roles.SuperAdmin, ), validate(dispenseMedicationSchema), controller.dispenseMedication );
router.post( "/:medicationId/start", requireRoles( Roles.Pharmacist, Roles.SuperAdmin ), validate(startDispensingSchema),  controller.startDispensing );
router.post( "/:medicationId/cancel", requireRoles(Roles.Pharmacist, Roles.SuperAdmin), validate(cancelDispensingSchema), controller.cancelDispensing );
router.get( "/inventory/low-stock", requireRoles( Roles.Pharmacist, Roles.ClinicAdmin, Roles.SuperAdmin ), controller.getLowStock );
router.get( "/inventory/expiring", requireRoles( Roles.Pharmacist, Roles.ClinicAdmin, Roles.SuperAdmin ), controller.getExpiringInventory );
router.post( "/purchases", requireRoles( Roles.Pharmacist, Roles.ClinicAdmin, Roles.SuperAdmin ), validate(createPurchaseSchema), controller.createPurchase );
router.get( "/purchases", requireRoles( Roles.Pharmacist, Roles.ClinicAdmin, Roles.SuperAdmin ), controller.listPurchases);
router.get( "/purchases/:id", requireRoles( Roles.Pharmacist, Roles.ClinicAdmin, Roles.SuperAdmin ), controller.getPurchase );
router.post( "/purchases/:id/receive", requireRoles( Roles.Pharmacist, Roles.ClinicAdmin, Roles.SuperAdmin ), controller.receivePurchase );


router.post( "/inventory/:id/adjust", requireRoles( Roles.Pharmacist, Roles.ClinicAdmin, Roles.SuperAdmin ), validate(adjustInventorySchema), controller.adjustInventory );
router.post( "/inventory/:id/expire", requireRoles( Roles.Pharmacist, Roles.ClinicAdmin, Roles.SuperAdmin ), validate(expireInventorySchema), controller.expireInventory );
router.post( "/inventory/:id/damage", requireRoles( Roles.Pharmacist, Roles.ClinicAdmin, Roles.SuperAdmin ), validate(damageInventorySchema), controller.damageInventory );
router.post( "/inventory/:id/return", requireRoles( Roles.Pharmacist, Roles.ClinicAdmin, Roles.SuperAdmin ), validate(returnInventorySchema), controller.returnInventory );
router.post( "/inventory/:id/transfer", requireRoles( Roles.Pharmacist, Roles.ClinicAdmin, Roles.SuperAdmin ), validate(transferInventorySchema), controller.transferInventory );
router.get( "/inventory/:id", requireRoles( Roles.Pharmacist, Roles.ClinicAdmin, Roles.SuperAdmin ),controller.getInventoryById);
router.patch( "/inventory/:id", requireRoles( Roles.Pharmacist, Roles.ClinicAdmin, Roles.SuperAdmin ), validate(updateInventorySchema), controller.updateInventory );

router.patch( "/purchases/:id", requireRoles( Roles.Pharmacist, Roles.ClinicAdmin, Roles.SuperAdmin ), validate(updatePurchaseSchema), controller.updatePurchase );
router.delete( "/purchases/:id", requireRoles( Roles.Pharmacist, Roles.ClinicAdmin, Roles.SuperAdmin ), validate(updatePurchaseSchema), controller.deletePurchase );

//Pharmacy Dashboard
router.get( "/dashboard", requireRoles( Roles.Pharmacist, Roles.ClinicAdmin, Roles.SuperAdmin ), controller.getDashboard );
router.get( "/reports/dispensing", requireRoles( Roles.Pharmacist, Roles.ClinicAdmin, Roles.SuperAdmin ), controller.getDispensingReport );
router.get( "/reports/inventory", requireRoles( Roles.Pharmacist, Roles.ClinicAdmin, Roles.SuperAdmin ), controller.getInventoryReport );
router.get( "/reports/purchases", requireRoles( Roles.Pharmacist, Roles.ClinicAdmin, Roles.SuperAdmin ), controller.getPurchaseReport );


export default router;