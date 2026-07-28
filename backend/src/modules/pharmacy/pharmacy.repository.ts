import { MedicationStatus, PurchaseStatus } from "@prisma/client";
import { prisma } from "../../config/prisma.js";

/**
 * Pharmacy Worklist
 */
export const findWorklist = (clinicId?: string) => {
  return prisma.medication.findMany({
    where: {
      ...(clinicId ? { clinicId } : {}),
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      patient: {
        select: {
          id: true,
          mrn: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          gender: true,
        },
      },

      prescribedByAccount: {
        include: {
          person: true,
        },
      },

      encounter: true,

      medicationDispensings: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });
};

export const findMedicationById = (id: string) => {
  return prisma.medication.findUnique({
    where: { id },
  });
};

export const findInventoryById = (id: string) => {
  return prisma.medicationInventory.findUnique({
    where: { id },

    include: {
      product: true,
      supplier: true,
    },
  });
};

export const updateInventoryQuantity = (
  tx: any,
  inventoryId: string,
  quantity: number
) => {
  return tx.medicationInventory.update({
    where: {
      id: inventoryId,
    },

    data: {
      quantity,
    },
  });
};

export const createDispensing = (
  tx: any,
  data: any
) => {
  return tx.medicationDispensing.create({
    data,

    include: {
      inventory: {
        include: {
          product: true,
        },
      },

      medication: {
        include: {
          patient: true,
        },
      },

      dispensedByAccount: {
        include: {
          person: true,
        },
      },
    },
  });
};

export const cancelMedicationDispensing = (
  medicationId: string,
  notes?: string
) => {
  return prisma.medicationDispensing.updateMany({
    where: {
      medicationId,
      status: {
        in: ["pending", "preparing"],
      },
    },

    data: {
      status: "cancelled",
      notes,
    },
  });
};

export const updateMedicationStatus = (
  medicationId: string,
  status: MedicationStatus
) => {
  return prisma.medication.update({
    where: {
      id: medicationId,
    },

    data: {
      status,
    },
  });
};


/**
 * Inventory
 */
export const findInventory = (clinicId?: string) => {
  return prisma.medicationInventory.findMany({
    where: { ...(clinicId ? { clinicId } : {}), },

    orderBy: {
      expiryDate: "asc",
    },

    include: {
      product: true,
      supplier: true,
    },
  });
};

export const createInventory = (data: any) => {
  return prisma.medicationInventory.create({
    data,

    include: {
      product: true,
      supplier: true,
    },
  });
};

export const findProductById = (id: string) => {
  return prisma.medicationProduct.findUnique({
    where: { id },
  });
};

export const findSupplierById = (id: string) => {
  return prisma.supplier.findUnique({
    where: { id },
  });
};

export const updateInventory = ( inventoryId: string, data: any ) => {
  return prisma.medicationInventory.update({
    where: {
      id: inventoryId,
    },

    data: {
      ...data,

      ...(data.expiryDate && { expiryDate: new Date(data.expiryDate),
      }),
    },

    include: {
      product: true,
      supplier: true,
    },
  });
};

export const findLowStock = (clinicId?: string) => {
  return prisma.medicationInventory.findMany({
    where: {
      ...(clinicId ? { clinicId } : {}),
      quantity: {
        lte: prisma.medicationInventory.fields.minimumStock, //Less Than or Equal :  WHERE quantity <= minimumStock;
      },
    },

    orderBy: {
      quantity: "asc",
    },

    include: {
      product: true,
      supplier: true,
    },
  });
};

export const findExpiringInventory = ( clinicId: string | undefined, expiryDate: Date ) => {
  return prisma.medicationInventory.findMany({
    where: {
      ...(clinicId ? { clinicId } : {}),
      expiryDate: {
        lte: expiryDate,
      },
    },

    orderBy: {
      expiryDate: "asc",
    },

    include: {
      product: true,
      supplier: true,
    },
  });
};

export const findInventoryByIdTx = ( tx: any, id: string ) => {
  return tx.medicationInventory.findUnique({
    where: {
      id,
    },

    include: {
      product: true,
      supplier: true,
    },
  });
};


/**
 *  Purchase
 */
export const createPurchase = ( data: any, currentUser: any ) => {
  return prisma.purchase.create({
    data: {
      clinicId: currentUser.clinicId,
      supplierId: data.supplierId,
      createdByAccountId: currentUser.accountId,

      items: {
        create: data.items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          batchNumber: item.batchNumber,
          expiryDate: new Date(item.expiryDate),
        })),
      },
    },

    include: {
      supplier: true,

      createdByAccount: {
        include: {
          person: true,
        },
      },

      items: {
        include: {
          product: true,
        },
      },
    },
  });
};

export const findPurchases = (clinicId?: string) => {
  return prisma.purchase.findMany({
     where: {
      ...(clinicId ? { clinicId } : {}),
    },

    orderBy: {
      orderedAt: "desc"
    },
    include: {
      supplier: true,

      createdByAccount: {
        include: {
          person: true
        }
      },

      items: {
        include: {
          product: true,
        }
      }
    },
  })
}

export const findPurchaseById = (id: string) => {
  return prisma.purchase.findUnique({
    where: { id },

    include: {
      supplier: true,

      createdByAccount: {
        include: {
          person: true,
        },
      },

      items: {
        include: {
          product: true,
        },
      },
    },
  });
};

export const updatePurchase = ( purchaseId: string, data: any ) => {
  return prisma.$transaction(async (tx) => {

    if (data.items) {
      await tx.purchaseItem.deleteMany({
        where: {
          purchaseId,
        },
      });

      await tx.purchaseItem.createMany({
        data: data.items.map((item: any) => ({
          purchaseId,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          batchNumber: item.batchNumber,
          expiryDate: new Date(item.expiryDate),
        })),
      });
    }

    return tx.purchase.update({
      where: {
        id: purchaseId,
      },

      data: {
        supplierId: data.supplierId,
      },

      include: {
        supplier: true,

        createdByAccount: {
          include: {
            person: true,
          },
        },

        items: {
          include: {
            product: true,
          },
        },
      },
    });
  });
};

export const deletePurchase = ( purchaseId: string ) => {
  return prisma.purchase.delete({
    where: {
      id: purchaseId,
    },
  });
};

export const receivePurchase = (purchaseId: string) => {
  return prisma.$transaction(async (tx) => {

    const purchase = await tx.purchase.findUnique({
      where: {
        id: purchaseId,
      },

      include: {
        items: true,
      },
    });

    if (!purchase)
      throw new Error("Purchase not found");

    if (purchase.status === PurchaseStatus.received)
      throw new Error("Purchase has already been received");

    for (const item of purchase.items) {

      // Create inventory
      const inventory = await tx.medicationInventory.create({
        data: {
          clinicId: purchase.clinicId,
          supplierId: purchase.supplierId,
          productId: item.productId,
          batchNumber: item.batchNumber,
          expiryDate: item.expiryDate,
          quantity: item.quantity,
          minimumStock: 100,
          location: "Main Pharmacy",
        },
      });

      // Record ledger entry
      await createStockMovement(tx, {
        clinicId: purchase.clinicId,
        inventoryId: inventory.id,
        productId: item.productId,
        performedByAccountId: purchase.createdByAccountId,
        movementType: "purchase",

        // Positive because stock increased
        quantity: item.quantity,

        // Current balance after receiving
        balanceAfter: inventory.quantity,

        referenceId: purchase.id,
        referenceType: "purchase",

        batchNumber: item.batchNumber,
      });
    }

    return tx.purchase.update({
      where: {
        id: purchase.id,
      },

      data: {
        status: PurchaseStatus.received,
        receivedAt: new Date(),
      },

      include: {
        supplier: true,

        createdByAccount: {
          include: {
            person: true,
          },
        },

        items: {
          include: {
            product: true,
          },
        },
      },
    });
  });
};


/**
 * Pharmacy Dashboard
 */
export const getDashboard = async (clinicId?: string) => {
  const where = clinicId ? { clinicId } : {};

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const next30Days = new Date();
  next30Days.setDate(next30Days.getDate() + 30);

  const [
    medications,
    dispensedToday,
    pendingPurchases,
    receivedToday,
    inventory,
    expiringSoon,
    inventoryItems,
    inventoryQuantity,
    suppliers,
  ] = await Promise.all([
    prisma.medication.findMany({
      where: {
        ...where,
        status: "active",
      },

      select: {
        medicationDispensings: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            status: true,
          },
        },
      },
    }),

    prisma.medicationDispensing.count({
      where: {
        ...where,
        dispensedAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    }),

    prisma.purchase.count({
      where: {
        ...where,
        status: "pending",
      },
    }),

    prisma.purchase.count({
      where: {
        ...where,
        receivedAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    }),

    prisma.medicationInventory.findMany({
      where,
      select: {
        quantity: true,
        minimumStock: true,
      },
    }),

    prisma.medicationInventory.count({
      where: {
        ...where,
        expiryDate: {
          gte: new Date(),
          lte: next30Days,
        },
      },
    }),

    prisma.medicationInventory.count({
      where,
    }),

    prisma.medicationInventory.aggregate({
      where,
      _sum: {
        quantity: true,
      },
    }),

    prisma.supplier.count({
      where,
    }),
  ]);

  const pendingDispensing = medications.filter(
    (m) =>
      m.medicationDispensings.length === 0 ||
      ["pending", "preparing"].includes(
        m.medicationDispensings[0].status
      )
  ).length;

  const lowStockItems = inventory.filter(
    (item) => item.quantity <= item.minimumStock
  ).length;

  return {
    pendingDispensing,
    dispensedToday,
    pendingPurchases,
    receivedToday,
    lowStockItems,
    expiringSoon,
    inventoryItems,
    inventoryQuantity: inventoryQuantity._sum.quantity ?? 0,
    suppliers,
  };
};

// Pharmacy Reports
/**
 * Pharmacy Reports
 */
export const getDispensingReport = (
  clinicId?: string,
  filters?: any
) => {
  return prisma.medicationDispensing.findMany({
    where: {
      ...(clinicId && { clinicId }),

      ...(filters?.patientId && {
        medication: {
          patientId: filters.patientId,
        },
      }),

      ...(filters?.productId && {
        inventory: {
          productId: filters.productId,
        },
      }),

      ...(filters?.pharmacistId && {
        dispensedByAccountId: filters.pharmacistId,
      }),

      ...(filters?.from || filters?.to
        ? {
            dispensedAt: {
              ...(filters.from && {
                gte: new Date(filters.from),
              }),

              ...(filters.to && {
                lte: new Date(filters.to),
              }),
            },
          }
        : {}),
    },

    orderBy: {
      dispensedAt: "desc",
    },

    include: {
      medication: {
        include: {
          patient: true,
        },
      },

      inventory: {
        include: {
          product: true,
          supplier: true,
        },
      },

      dispensedByAccount: {
        include: {
          person: true,
        },
      },
    },
  });
};

export const getInventoryReport = async ( clinicId?: string, filters?: any ) => {
  const where: any = {
    ...(clinicId && { clinicId }),

    ...(filters?.productId && {
      productId: filters.productId,
    }),

    ...(filters?.supplierId && {
      supplierId: filters.supplierId,
    }),
  };

  const inventory = await prisma.medicationInventory.findMany({
    where,

    orderBy: {
      expiryDate: "asc",
    },

    include: {
      product: true,
      supplier: true,
    },
  });

  const today = new Date();

  return inventory.filter((item) => {
    const isLowStock = item.quantity <= item.minimumStock;

    const isExpired = item.expiryDate < today;

    const daysUntilExpiry = Math.ceil(
      (item.expiryDate.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (
      filters?.lowStock === "true" &&
      !isLowStock
    )
      return false;

    if (
      filters?.expired === "true" &&
      !isExpired
    )
      return false;

    if (
      filters?.expiringIn &&
      daysUntilExpiry > Number(filters.expiringIn)
    )
      return false;

    return true;
  })
  .map((item) => {
    const daysUntilExpiry = Math.ceil(
      (item.expiryDate.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return {
      ...item,

      lowStock:
        item.quantity <= item.minimumStock,

      expired:
        item.expiryDate < today,

      daysUntilExpiry,
    };
  });
};

export const getPurchaseReport = async (
  clinicId?: string,
  filters?: {
    from?: string;
    to?: string;
    status?: PurchaseStatus;
    supplierId?: string;
    createdByAccountId?: string;
    productId?: string;
  }
) => {
  const where: any = {};

  if (clinicId)
    where.clinicId = clinicId;

  if (filters?.status)
    where.status = filters.status;

  if (filters?.supplierId)
    where.supplierId = filters.supplierId;

  if (filters?.createdByAccountId)
    where.createdByAccountId = filters.createdByAccountId;

  if (filters?.from || filters?.to) {
    where.orderedAt = {};

    if (filters.from)
      where.orderedAt.gte = new Date(filters.from);

    if (filters.to)
      where.orderedAt.lte = new Date(filters.to);
  }

  if (filters?.productId) {
    where.items = {
      some: {
        productId: filters.productId,
      },
    };
  }

  const purchases = await prisma.purchase.findMany({
    where,

    orderBy: {
      orderedAt: "desc",
    },

    include: {
      supplier: true,

      createdByAccount: {
        include: {
          person: true,
        },
      },

      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return purchases.map((purchase) => ({
    ...purchase,

    totalItems: purchase.items.length,

    totalQuantity: purchase.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    ),

    totalValue: purchase.items.reduce(
      (sum, item) => sum + (item.quantity * (item.unitPrice ?? 0)),
      0
    ),
  }));
};

/**
 * Stock Movements (Reuseable function)
 */
export const createStockMovement = (
  // we're using tx because this helper will always be called from inside an existing transaction, and therfore not using tx.stockMovement.create(...)
  tx: any,
  data: {
    clinicId: string;
    inventoryId?: string;
    productId: string;
    performedByAccountId?: string;
    movementType: | "purchase" | "dispensing" | "adjustment" | "expired" | "damaged" | "returned" | "transferred"; //StockMovementType
    quantity: number;
    balanceAfter: number;
    reason?: string;
    referenceId?: string;
    referenceType?: "purchase" | "dispensing" | "adjustment"; //StockReferenceType
    batchNumber?: string;
  }
) => {
  return tx.stockMovement.create({
    data: {
      clinicId: data.clinicId,
      inventoryId: data.inventoryId,
      productId: data.productId,
      performedByAccountId: data.performedByAccountId,
      movementType: data.movementType,
      quantity: data.quantity,
      balanceAfter: data.balanceAfter,
      reason: data.reason,
      referenceId: data.referenceId,
      referenceType: data.referenceType,
      batchNumber: data.batchNumber,
    },
  });
};