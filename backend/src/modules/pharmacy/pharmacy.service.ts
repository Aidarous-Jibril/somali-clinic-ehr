import { prisma } from "../../config/prisma.js";
import { Roles } from "../../constants/roles.js";
import * as repo from "./pharmacy.repository.js";

import type { adjustInventoryInput, CreateInventoryInput, CreatePurchaseInput, DamageInventoryInput, DispenseMedicationInput, ReturnInventoryInput, TransferInventoryInput, UpdateInventoryInput, UpdatePurchaseInput, } from "./pharmacy.schema.js";

/**
 * Pharmacy Worklist
 */
export const getWorklist = async (currentUser: any) => {
  const clinicId = currentUser.role ===  Roles.SuperAdmin  ? undefined : currentUser.clinicId;
  return repo.findWorklist(clinicId);
};
/**
 * Start Dispensing
 */
export const startDispensing = async ( medicationId: string, currentUser: any ) => {
  const medication = await repo.findMedicationById(medicationId);

  if (!medication)
    throw new Error("Medication not found");

  if ( currentUser.role !==  Roles.SuperAdmin  && medication.clinicId !== currentUser.clinicId )
    throw new Error("Medication not found");

  return medication;
};

/**
 * Dispense Medication
 */
export const dispenseMedication = async (
  medicationId: string,
  input: DispenseMedicationInput,
  currentUser: any
) => {
  const inventory = await repo.findInventoryById(input.inventoryId);

  if (!inventory)
    throw new Error("Inventory batch not found");

  if (
    currentUser.role !==  Roles.SuperAdmin  &&
    inventory.clinicId !== currentUser.clinicId
  )
    throw new Error("Inventory not found");

  if (inventory.quantity < input.dispensedQuantity)
    throw new Error("Insufficient stock");

  const medication = await repo.findMedicationById(medicationId);

  if (!medication)
    throw new Error("Medication not found");

  if (
    currentUser.role !==  Roles.SuperAdmin  &&
    medication.clinicId !== currentUser.clinicId
  )
    throw new Error("Medication not found");

  return prisma.$transaction(async (tx) => {
    // Remaining stock after dispensing
    const remainingQuantity =
      inventory.quantity - input.dispensedQuantity;

    // Update inventory quantity
    await repo.updateInventoryQuantity(
      tx,
      inventory.id,
      remainingQuantity
    );

    // Create dispensing record
    const dispensing = await repo.createDispensing(tx, {
      clinicId: medication.clinicId,
      medicationId: medication.id,
      inventoryId: inventory.id,
      dispensedQuantity: input.dispensedQuantity,
      status: "dispensed",
      dispensedByAccountId: currentUser.accountId,
      notes: input.notes,
      dispensedAt: new Date(),
    });

    // Record stock movement in ledger
    await repo.createStockMovement(tx, {
      clinicId: inventory.clinicId,
      inventoryId: inventory.id,
      productId: inventory.productId,
      performedByAccountId: currentUser.accountId,

      movementType: "dispensing",

      // Negative because stock leaves inventory
      quantity: -input.dispensedQuantity,

      // Stock remaining after dispensing
      balanceAfter: remainingQuantity,

      referenceId: dispensing.id,
      referenceType: "dispensing",

      batchNumber: inventory.batchNumber,
    });

    return dispensing;
  });
};

/**
 * Cancel Dispensing
 */
export const cancelDispensing = async ( medicationId: string, notes: string | undefined, currentUser: any ) => {
  const medication = await repo.findMedicationById(medicationId);

  if (!medication) 
    throw new Error("Medication not found");

  if ( currentUser.role !==  Roles.SuperAdmin  && medication.clinicId !== currentUser.clinicId ) 
    throw new Error("Medication not found");

  return repo.cancelMedicationDispensing( medication.id, notes );
};

/**
 * Inventory
 */
export const listInventory = async (currentUser: any) => {
  const clinicId = currentUser.role ===  Roles.SuperAdmin  ? undefined : currentUser.clinicId;

  return repo.findInventory(clinicId);
};

/**
 * Receive Inventory
 */
/**
 * Receive Inventory
 */
export const createInventory = async ( input: CreateInventoryInput, currentUser: any ) => {
  const product = await repo.findProductById(input.productId);

  if (!product)
    throw new Error("Medication product not found");

  if ( currentUser.role !==  Roles.SuperAdmin  && product.clinicId !== currentUser.clinicId )
    throw new Error("Medication product not found");

  const supplier = await repo.findSupplierById(input.supplierId);

  if (!supplier)
    throw new Error("Supplier not found");

  if ( currentUser.role !==  Roles.SuperAdmin  && supplier.clinicId !== currentUser.clinicId)
    throw new Error("Supplier not found");

  return repo.createInventory({
    clinicId: currentUser.clinicId,
    productId: input.productId,
    supplierId: input.supplierId,
    batchNumber: input.batchNumber,
    expiryDate: new Date(input.expiryDate),
    quantity: input.quantity,
    minimumStock: input.minimumStock,
    location: input.location,
  });
};

export const getIventoryById = async (inventoryId: string, currentUser: any) => {
  const inventory = await repo.findInventoryById(inventoryId)

  if(!inventory) throw new Error("Inventory not found");

  if( currentUser.role !==  Roles.SuperAdmin  && inventory.clinicId !== currentUser.clinicId)
    throw new Error("Inventory not found");

  return inventory
} 

export const updateInventory = async (inventoryId: string, input: UpdateInventoryInput, currentUser: any) => {
  const inventory = await repo.findInventoryById(inventoryId)

  if(!inventory) throw new Error("Inventory not found");

  if( currentUser.role !==  Roles.SuperAdmin  && inventory.clinicId !== currentUser.clinicId)
    throw new Error("Inventory not found");

  if(input.productId) {
    const product = await repo.findProductById(input.productId)

    if(!product) 
      throw new Error("Medication product not found")

     if(currentUser.role !==  Roles.SuperAdmin  && product.clinicId !== currentUser.clinicId) 
      throw new Error("Medication product not found");
  }

  if (input.supplierId) {
    const supplier = await repo.findSupplierById(input.supplierId);

    if (!supplier)
      throw new Error("Supplier not found");

    if (
      currentUser.role !==  Roles.SuperAdmin  &&
      supplier.clinicId !== currentUser.clinicId
    )
      throw new Error("Supplier not found");
  }

   if (input.supplierId) {
    const supplier = await repo.findSupplierById(input.supplierId);

    if (!supplier)
      throw new Error("Supplier not found");

    if ( currentUser.role !==  Roles.SuperAdmin  && supplier.clinicId !== currentUser.clinicId )
      throw new Error("Supplier not found");
  }

  return repo.updateInventory(inventoryId, input);
} 

export const getLowStock = async ( currentUser: any ) => {
  const clinicId = currentUser.rele ===  Roles.SuperAdmin  ? undefined : currentUser.clinicId

  return repo.findLowStock(clinicId)
}

export const getExpiringInventory = async (currentUser: any) => {
  const clinicId = currentUser.role ===  Roles.SuperAdmin  ? undefined : currentUser.clinicId;

  const expiryDate = new Date();
  // July has 31 days
  // 55 - 31 = 24
  expiryDate.setDate(expiryDate.getDate() + 30);

  return repo.findExpiringInventory(clinicId, expiryDate);
};

/**
 * Create Purchase
 */
export const createPurchase = async ( input: CreatePurchaseInput, currentUser: any ) => {
  const supplier = await repo.findSupplierById(input.supplierId);

  if (!supplier)
    throw new Error("Supplier not found");

  if ( currentUser.role !==  Roles.SuperAdmin  && supplier.clinicId !== currentUser.clinicId )
    throw new Error("Supplier not found");

  for (const item of input.items) {
    const product = await repo.findProductById(item.productId);

    if (!product)
      throw new Error("Medication product not found");

    if ( currentUser.role !==  Roles.SuperAdmin  && product.clinicId !== currentUser.clinicId )
      throw new Error("Medication product not found");
  }

  return repo.createPurchase(input, currentUser);
};

export const listPurchases = async ( currentUser: any ) => {
  const clinicId = currentUser.role !==  Roles.SuperAdmin  ? undefined : currentUser.clinicId

  return repo.findPurchases(clinicId);
}

export const getPurchase = async ( purchaseId: string, currentUser: any ) => {
  const purchase = await repo.findPurchaseById(purchaseId);

  if (!purchase)
    throw new Error("Purchase not found");

  if ( currentUser.role !==  Roles.SuperAdmin  && purchase.clinicId !== currentUser.clinicId )
    throw new Error("Purchase not found");

  return purchase;
};


/**
 * Update Purchase
 */
export const updatePurchase = async (
  purchaseId: string,
  input: UpdatePurchaseInput,
  currentUser: any
) => {
  const purchase = await repo.findPurchaseById(purchaseId);

  if (!purchase)
    throw new Error("Purchase not found");

  if ( currentUser.role !==  Roles.SuperAdmin  && purchase.clinicId !== currentUser.clinicId )
    throw new Error("Purchase not found");

  if (purchase.status !== "pending")
    throw new Error("Purchase already received");

  if (input.supplierId) {
    const supplier = await prisma.supplier.findFirst({
      where: {
        id: input.supplierId,
        clinicId: purchase.clinicId,
      },
    });

    if (!supplier)
      throw new Error("Supplier not found");
  }

  if (input.items) {
    for (const item of input.items) {
      const product = await prisma.medicationProduct.findFirst({
        where: {
          id: item.productId,
          clinicId: purchase.clinicId,
        },
      });

      if (!product)
        throw new Error("Medication product not found");
    }
  }

  return repo.updatePurchase( purchaseId, input );
};

/**
 * Delete Purchase
 */
export const deletePurchase = async ( purchaseId: string, currentUser: any ) => {
  const purchase = await repo.findPurchaseById(purchaseId);

  if (!purchase)
    throw new Error("Purchase not found");

  if ( currentUser.role !==  Roles.SuperAdmin  && purchase.clinicId !== currentUser.clinicId )
    throw new Error("Purchase not found");

  if (purchase.status !== "pending")
    throw new Error("Only pending purchases can be deleted");

  await repo.deletePurchase(purchaseId);
};

/**
 * Receive Purchase
 */
export const receivePurchase = async ( purchaseId: string, currentUser: any ) => {
  const purchase = await repo.findPurchaseById(purchaseId);

  if (!purchase)
    throw new Error("Purchase not found");

  if ( currentUser.role !==  Roles.SuperAdmin  && purchase.clinicId !== currentUser.clinicId )
    throw new Error("Purchase not found");

  if (purchase.status !== "pending")
    throw new Error("Purchase already received");

  return repo.receivePurchase(purchase.id);
};


/**
 * Pharmacy Dashboard
 */
export const getDashboard = async (currentUser: any) => {
  const clinicId =
    currentUser.role ===  Roles.SuperAdmin  ? undefined : currentUser.clinicId;

  return repo.getDashboard(clinicId);
};

// Dispensing Report
export const getDispensingReport = async ( currentUser: any, filters: any ) => {
  const clinicId = currentUser.role ===  Roles.SuperAdmin  ? undefined : currentUser.clinicId;

  return repo.getDispensingReport(clinicId, filters);
};

// Inventory Report
export const getInventoryReport = async ( currentUser: any, filters: any ) => {
  const clinicId = currentUser.role ===  Roles.SuperAdmin  ? undefined : currentUser.clinicId;

  return repo.getInventoryReport(clinicId, filters);
};

// Purchase Report
export const getPurchaseReport = async ( currentUser: any, filters: any ) => {
  const clinicId =
    currentUser.role === Roles.SuperAdmin ? undefined : currentUser.clinicId;

  return repo.getPurchaseReport(clinicId, filters);
};

/** inventory adjustment **/
export const adjustInventory = async (
  inventoryId: string,
  input : adjustInventoryInput, 
  currentUser: any
) => {

  const inventory = await repo.findInventoryById(inventoryId);

  if (!inventory)
    throw new Error("Inventory not found");

  if ( currentUser.role !== Roles.SuperAdmin && inventory.clinicId !== currentUser.clinicId)
    throw new Error("Inventory not found");

  // Calculate adjustment
  const difference = input.quantity - inventory.quantity;

  // Nothing changed
  if (difference === 0)
    throw new Error("Inventory quantity is already correct");

  return prisma.$transaction(async (tx) => {

    // Update inventory
    await repo.updateInventoryQuantity(
      tx,
      inventory.id,
      input.quantity
    );

    // Record ledger entry
    await repo.createStockMovement(tx, {
      clinicId: inventory.clinicId,
      inventoryId: inventory.id,
      productId: inventory.productId,
      performedByAccountId: currentUser.accountId,

      movementType: "adjustment",

      // Positive or negative automatically
      quantity: difference,
      balanceAfter: input.quantity,
      reason: input.reason,
      referenceType: "adjustment",
      batchNumber: inventory.batchNumber,
    });

    return repo.findInventoryByIdTx( tx, inventory.id );
  });
};

/** Expire Inventory **/
export const expireInventory = async (
  inventoryId: string,
  input: {
    quantity: number;
    reason?: string;
  },
  currentUser: any
) => {
  return prisma.$transaction(async (tx) => {

    const inventory = await repo.findInventoryByIdTx(
      tx,
      inventoryId
    );

    if (!inventory)
      throw new Error("Inventory not found");

    if ( currentUser.role !== Roles.SuperAdmin && inventory.clinicId !== currentUser.clinicId )
      throw new Error("Inventory not found");

    if (input.quantity > inventory.quantity)
      throw new Error("Cannot expire more stock than available");

    const remainingQuantity = inventory.quantity - input.quantity;

    const updatedInventory =
      await repo.updateInventoryQuantity(
        tx,
        inventory.id,
        remainingQuantity
      );

    await repo.createStockMovement(tx, {
      clinicId: inventory.clinicId,
      inventoryId: inventory.id,
      productId: inventory.productId,
      performedByAccountId: currentUser.accountId,
      movementType: "expired",
      // Stock leaves inventory
      quantity: -input.quantity,
      // Quantity remaining afterwards
      balanceAfter: remainingQuantity,
      reason: input.reason ?? "Expired",
      batchNumber: inventory.batchNumber,
    });

    return updatedInventory;
  });
};


/**
 * Damage Inventory
 */
export const damageInventory = async ( inventoryId: string,input: DamageInventoryInput, currentUser: any ) => {
  return prisma.$transaction(async (tx) => {

    const inventory = await repo.findInventoryByIdTx( tx, inventoryId );

    if (!inventory)
      throw new Error("Inventory not found");

    if ( currentUser.role !== Roles.SuperAdmin && inventory.clinicId !== currentUser.clinicId )
      throw new Error("Inventory not found");

    if (input.quantity > inventory.quantity)
      throw new Error( "Cannot damage more stock than available" );

    const remainingQuantity =
      inventory.quantity - input.quantity;

    const updatedInventory =
      await repo.updateInventoryQuantity(
        tx,
        inventory.id,
        remainingQuantity
      );

    await repo.createStockMovement(tx, {
      clinicId: inventory.clinicId,
      inventoryId: inventory.id,
      productId: inventory.productId,
      performedByAccountId: currentUser.accountId,

      movementType: "damaged",
      quantity: -input.quantity,
      balanceAfter: remainingQuantity,
      reason: input.reason ?? "Broken package",
      batchNumber: inventory.batchNumber,
    });

    return updatedInventory;
  });
};

/**
 * Return Inventory
 */
export const returnInventory = async (
  inventoryId: string,
  input: ReturnInventoryInput,
  currentUser: any
) => {
  return prisma.$transaction(async (tx) => {

    const inventory = await repo.findInventoryByIdTx(
      tx,
      inventoryId
    );

    if (!inventory)
      throw new Error("Inventory not found");

    if ( currentUser.role !== Roles.SuperAdmin && inventory.clinicId !== currentUser.clinicId )
      throw new Error("Inventory not found");

    // Returned stock increases inventory
    const newQuantity = inventory.quantity + input.quantity;

    const updatedInventory =
      await repo.updateInventoryQuantity(
        tx,
        inventory.id,
        newQuantity
      );

    await repo.createStockMovement(tx, {
      clinicId: inventory.clinicId,
      inventoryId: inventory.id,
      productId: inventory.productId,
      performedByAccountId: currentUser.accountId,

      movementType: "returned",

      // Positive because stock comes back
      quantity: input.quantity,
      balanceAfter: newQuantity,
      reason: input.reason ?? "Returned to inventory",
      batchNumber: inventory.batchNumber,
    });

    return updatedInventory;
  });
};

/**
 * Transfer Inventory
 */
export const transferInventory = async (
  sourceInventoryId: string,
  input: TransferInventoryInput,
  currentUser: any
) => {
  return prisma.$transaction(async (tx) => {

    const sourceInventory =
      await repo.findInventoryByIdTx(
        tx,
        sourceInventoryId
      );

    if (!sourceInventory)
      throw new Error("Source inventory not found");

    const destinationInventory =
      await repo.findInventoryByIdTx(
        tx,
        input.destinationInventoryId
      );

    if (!destinationInventory)
      throw new Error("Destination inventory not found");

    if (
      sourceInventory.id ===
      destinationInventory.id
    )
      throw new Error( "Source and destination inventory cannot be the same" );

    if (
      currentUser.role !==  Roles.SuperAdmin &&
      (
        sourceInventory.clinicId !== currentUser.clinicId ||
        destinationInventory.clinicId !== currentUser.clinicId
      )
    )
      throw new Error("Inventory not found");

    if ( sourceInventory.clinicId !== destinationInventory.clinicId )
      throw new Error( "Cannot transfer inventory between clinics");

    if ( sourceInventory.quantity < input.quantity )
      throw new Error("Insufficient stock");

    const sourceBalance = sourceInventory.quantity - input.quantity;

    const destinationBalance = destinationInventory.quantity + input.quantity;

    await repo.updateInventoryQuantity(
      tx,
      sourceInventory.id,
      sourceBalance
    );

    const updatedDestination =
      await repo.updateInventoryQuantity(
        tx,
        destinationInventory.id,
        destinationBalance
      );

    // OUT movement
    await repo.createStockMovement(tx, {
      clinicId: sourceInventory.clinicId,
      inventoryId: sourceInventory.id,
      productId: sourceInventory.productId,
      performedByAccountId: currentUser.accountId,

      movementType: "transferred",

      quantity: -input.quantity,

      balanceAfter: sourceBalance,

      reason: input.reason ?? `Transferred to ${destinationInventory.location}`,

      batchNumber: sourceInventory.batchNumber,
    });

    // IN movement
    await repo.createStockMovement(tx, {
      clinicId: destinationInventory.clinicId,
      inventoryId: destinationInventory.id,
      productId: destinationInventory.productId,
      performedByAccountId: currentUser.accountId,

      movementType: "transferred",

      quantity: input.quantity,

      balanceAfter: destinationBalance,

      reason: input.reason ?? `Transferred from ${sourceInventory.location}`,

      batchNumber: destinationInventory.batchNumber,
    });

    return updatedDestination;
  });
};