import { z } from "zod";

export const startDispensingSchema = z.object({});

export type StartDispensingInput = z.infer< typeof startDispensingSchema >;

export const dispenseMedicationSchema = z.object({
  inventoryId: z.uuid({ message: "Inventory item ID must be valid", }),

  dispensedQuantity: z
    .number()
    .int()
    .positive({ message: "Dispensed quantity must be greater than zero",}),

  notes: z
    .string()
    .max(500)
    .optional(),
});

export type DispenseMedicationInput = z.infer< typeof dispenseMedicationSchema >;

export const cancelDispensingSchema = z.object({ notes: z.string().optional(), });
export type CancelDispensingInput = z.infer< typeof cancelDispensingSchema >;


export const createInventorySchema = z.object({
  productId: z.uuid({ message: "Product ID must be valid", }),
  supplierId: z.uuid({ message: "Supplier ID must be valid", }),
  batchNumber: z.string().min(1, { message: "Batch number is required", }),
  expiryDate: z.string({ message: "Expiry date is required", }),
  quantity: z.number({ message: "Quantity is required", }) .int() .positive({ message: "Quantity must be greater than 0", }),
  minimumStock: z.number({ message: "Minimum stock is required", }) .int() .min(0, { message: "Minimum stock cannot be negative", }),
  location: z.string().min(1, {message: "Location is required",}),
});

export type CreateInventoryInput = z.infer<typeof createInventorySchema>;

export const updateInventorySchema = createInventorySchema.partial();
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;


export const createPurchaseSchema = z.object({
  supplierId: z.uuid({ message: "Supplier ID must be valid", }),

  items: z
    .array(
      z.object({
        productId: z.uuid({ message: "Product ID must be valid",}),

        quantity: z
          .number({ message: "Quantity is required", })
          .int()
          .positive({ message: "Quantity must be greater than 0", }),

        unitPrice: z
          .number({ message: "Unit price must be a number", })
          .positive({ message: "Unit price must be greater than 0", })
          .optional(),

        batchNumber: z
          .string()
          .min(1, { message: "Batch number is required", }),

        expiryDate: z.string({ message: "Expiry date is required", }),
      })
    )
    .min(1, { message: "At least one item is required", }),
});

export type CreatePurchaseInput = z.infer<typeof createPurchaseSchema>;


export const updatePurchaseSchema = createPurchaseSchema.partial();
export type UpdatePurchaseInput = z.infer<typeof updatePurchaseSchema>;

/**
 * Adjust Inventory
 */
export const adjustInventorySchema = z.object({
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(0, "Quantity cannot be negative"),

  reason: z
    .string()
    .trim()
    .max(255, "Reason cannot exceed 255 characters")
    .optional(),
});

export type adjustInventoryInput = z.infer<typeof adjustInventorySchema>;

/**
 * Expired Inventory
 */
export const expireInventorySchema = z.object({
  quantity: z
  .number({
    message: "Quantity is required",
  })
  .int()
  .positive({
    message: "Quantity must be greater than 0",
  }),
  
  reason: z
  .string()
  .trim()
  .max(255, {
    message: "Reason cannot exceed 255 characters",
  })
  .optional(),
});

export type ExpireInventoryInput = z.infer<typeof expireInventorySchema>;

/**
 * Damaged Inventory
 */
export const damageInventorySchema = z.object({
  quantity: z
    .number({ message: "Quantity is required" })
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0"),

  reason: z
    .string()
    .trim()
    .max(255, "Reason cannot exceed 255 characters")
    .optional(),
});

export type DamageInventoryInput = z.infer<typeof damageInventorySchema>;

/**
 * Returned Inventory
 */
export const returnInventorySchema = z.object({
  quantity: z
    .number({ message: "Quantity is required" })
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0"),

  reason: z
    .string()
    .trim()
    .max(255, "Reason cannot exceed 255 characters")
    .optional(),
});

export type ReturnInventoryInput = z.infer<typeof returnInventorySchema>;

/**
 * Transfer Inventory between shelves
 */
export const transferInventorySchema = z.object({
  destinationInventoryId: z.uuid({ message: "Destination inventory ID must be valid" }),

  quantity: z
    .number({ message: "Quantity is required" })
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0"),

  reason: z
    .string()
    .trim()
    .max(255, "Reason cannot exceed 255 characters")
    .optional(),
});

export type TransferInventoryInput = z.infer<typeof transferInventorySchema>;