//radiology.repository.ts
import { prisma } from "../../config/prisma.js";
import path from "path";


export const findOrderById = (id: string) => {
  return prisma.order.findUnique({
    where: {
      id,
    },
  });
};

export const createRadiologyReport = async (input: {
  orderId: string;
  clinicId: string;
  accountId: string;

  impression: string;
  findings?: string;
  overallResult: "normal" | "high" | "low" | "critical";
  comment?: string;

  files: Express.Multer.File[];
}) => {
  return prisma.$transaction(async (tx) => {

    const report = await tx.radiologyReport.create({
      data: {
        clinicId: input.clinicId,

        patientId: (
          await tx.order.findUniqueOrThrow({
            where: {
              id: input.orderId,
            },
            select: {
              patientId: true,
            },
          })
        ).patientId,

        orderId: input.orderId,

        impression: input.impression,

        findings: input.findings,

        overallResult: input.overallResult,

        comment: input.comment,

        reportedByAccountId: input.accountId,
      },
    });

    if (input.files.length > 0) {

      await tx.radiologyImage.createMany({
        data: input.files.map((file, index) => ({
          reportId: report.id,

          fileName: file.originalname,

          filePath: file.path,

          mimeType: file.mimetype,

          fileSize: file.size,

          viewName: path.parse(file.originalname).name,

          displayOrder: index,
        })),
      });

    }

    await tx.order.update({
      where: {
        id: input.orderId,
      },

      data: {
        status: "resulted",

        resultedAt: new Date(),

        resultedByAccountId: input.accountId,
      },
    });

    return tx.radiologyReport.findUnique({
      where: {
        id: report.id,
      },

      include: {
        images: true,
      },
    });

  });
};


export const findRadiologyResultsByPatient = ( patientId: string, clinicId: string ) => {
  return prisma.radiologyReport.findMany({
    where: {
      patientId,
      clinicId,
    },

    include: {
      order: {
        select: {
          id: true,
          status: true,
          category: true,
          name: true,
          code: true,
        },
      },

      images: {
        orderBy: {
          displayOrder: "asc",
        },
      },

      reportedByAccount: {
        include: {
          person: true,
        },
      },
    },

    orderBy: {
      reportedAt: "desc",
    },
  });
};