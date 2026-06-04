import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";

export const findActiveContacts = async ( clinicId: string ) => {
  const [stays, referrals] = await Promise.all([
    prisma.inpatientStay.findMany({
      where: {
        clinicId,
        dischargedAt: null,
      },
      include: {
        patient: true,
        unit: true,
        encounter: {
          include: {
            clinicalParameterEntries: {
              where: {
                name: "NEWS2",
              },
              orderBy: {
                recordedAt: "desc",
              },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        bedCode: "asc",
      },
    }),

    prisma.referral.findMany({
      where: {
        clinicId,
        status: {
          not: "completed",
        },
      },
      include: {
        toUnit: true,
      },
    }),
  ]);

  return stays.map((stay) => ({
    ...stay,
    transferReferral: referrals.find(
      (r) =>
        r.patientId === stay.patientId &&
        r.encounterId === stay.encounterId
    ),
  }));
};

export const findStayById = ( stayId: string ) =>
  prisma.inpatientStay.findUnique({
    where: {
      id: stayId,
    },
    include: {
      patient: true,
      unit: true,
      encounter: {
        include: {
          clinicalParameterEntries: {
            orderBy: {
              recordedAt: "desc",
            },
          },
        },
      },
    },
  });

export const updatePlannedDischarge = ( stayId: string, plannedDischargeAt: Date, status: string ) =>
  prisma.inpatientStay.update({
    where: {
      id: stayId,
    },
    data: {
      plannedDischargeAt,
      plannedDischargeStatus: status,
    },
  });

export const updateBed = ( stayId: string, bedCode: string ) =>
  prisma.inpatientStay.update({
    where: {
      id: stayId,
    },
    data: {
      bedCode,
    },
  });

export const findCoordinationByStayId = ( stayId: string ) =>
  prisma.coordinationCase.findUnique({
    where: {
      stayId,
    },
  });

export const upsertCoordination = (
stayId: string,
  data: {
    infoSharingConsent: string;
    coordinationNeeded: string;
    sipConsent: string;
    adminComment: string;
    recipients: Prisma.InputJsonValue;
  }
) =>
  prisma.coordinationCase.upsert({
    where: { stayId },
    create: {
      stayId,
      ...data,
    },
    update: data,
  });

export const createTransferReferral = async (
  data: {
    clinicId: string;
    patientId: string;
    encounterId?: string;
    fromUnitId?: string;
    sentByAccountId: string;
    toUnitName: string;
    reason: string;
    plannedAt: Date;
    technicalUnit: string;
    specialBedNeeds: string;
    transferDecided: boolean;
    patientReady: boolean;
  }
) => {
  const toUnit =
    await prisma.unit.findFirst({
      where: {
        clinicId: data.clinicId,
        name: data.toUnitName,
      },
    });

  return prisma.referral.create({
    data: {
      clinicId: data.clinicId,
      patientId: data.patientId,

      encounterId:
        data.encounterId || undefined,

      fromUnitId:
        data.fromUnitId || undefined,

      toUnitId: toUnit?.id,

      sentByAccountId:
        data.sentByAccountId,

      status: "unassessed",

      urgent: false,

      hasAdditionalInfo:
        !!data.reason,

      details: JSON.stringify({
        type: "inpatient-transfer",
        reason: data.reason,
        plannedAt: data.plannedAt,
        technicalUnit:
          data.technicalUnit,
        specialBedNeeds:
          data.specialBedNeeds,
        transferDecided:
          data.transferDecided,
        patientReady:
          data.patientReady,
      }),
    },
  });
};

export const findTransfers = async ( clinicId: string, unitId?: string ) => {
  const rows =
    await prisma.referral.findMany({
      where: {
        clinicId,

        ...(unitId && {
          OR: [
            { fromUnitId: unitId },
            { toUnitId: unitId },
          ],
        }),
      },

      include: {
        patient: true,
        fromUnit: true,
        toUnit: true,
        fromClinic: true,
        clinic: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return rows.map((r: any) => ({
    id: r.id,

    direction:
      r.fromUnitId === unitId
        ? "outbound"
        : "inbound",

    type: "Same episode",

    name:
      `${r.patient.firstName} ${r.patient.lastName}`,

    nationalId:
      r.patient.nationalId || "",

    fromFacility:
      r.fromClinic?.name ||
      r.clinic?.name ||
      "",

    toFacility:
      r.clinic?.name || "",

    fromUnit:
      r.fromUnit?.name || "",

    toUnit:
      r.toUnit?.name || "",

    transferTime:
      r.createdAt.toISOString(),

    bedReserved:
      r.details?.startsWith("BED:")
        ? r.details.replace("BED:", "")
        : "",

    status:
      r.status === "completed"
        ? "completedToday"
        : "planned",
  }));
};

export const updateReferralBed = ( referralId: string, bedCode: string ) =>
  prisma.referral.update({
    where: {
      id: referralId,
    },
    data: {
      details: `BED:${bedCode}`,
    },
  });

export const completeTransfer = ( referralId: string ) =>
  prisma.referral.update({
    where: {
      id: referralId,
    },
    data: {
      status: "completed",
    },
    include: {
      patient: true,
      clinic: true,
      toUnit: true,
    },
  });

export const createStayFromReferral = ( referral: any ) => {
  const bedCode =
    referral.details?.startsWith("BED:")
      ? referral.details.replace(
          "BED:",
          ""
        )
      : "Unassigned";

  return prisma.inpatientStay.create({
    data: {
      clinicId: referral.clinicId,
      patientId: referral.patientId,

      encounterId:
        referral.encounterId,

      unitId: referral.toUnitId,

      bedCode,

      team: "",
    },
  });
};

export const closeStay = async ( stayId: string ) => {
  const now = new Date();

  const stay =
    await prisma.inpatientStay.findUnique({
      where: {
        id: stayId,
      },
    });

  if (!stay) {
    throw new Error("Stay not found");
  }

  await prisma.inpatientStay.update({
    where: {
      id: stayId,
    },
    data: {
      dischargedAt: now,
    },
  });

  if (stay.encounterId) {
    await prisma.encounter.update({
      where: {
        id: stay.encounterId,
      },
      data: {
        endedAt: now,
        status: "closed",
      },
    });
  }

  return {
    success: true,
  };
};

export const createAdmission = async ( data: any ) => {
  const identifier = String(
    data.nationalId || ""
  ).trim();

  const fullName = String(
    data.name || ""
  ).trim();

  const parts = fullName
    .split(" ")
    .filter(Boolean);

  const firstName =
    parts.shift() || "Unknown";

  const lastName =
    parts.join(" ") || "Patient";

  const admittedAt = new Date(
    `${data.startDate}T${data.startTime}:00`
  );

  return prisma.$transaction(
    async (tx) => {
      let patient = null;

      if (identifier) {
        patient =
          await tx.patient.findFirst({
            where: {
              clinicId:
                data.clinicId,
              phone: identifier,
            },
          });
      }

      if (!patient && identifier) {
        patient =
          await tx.patient.findFirst({
            where: {
              clinicId:
                data.clinicId,
              nationalId:
                identifier,
            },
          });
      }

      if (!patient) {
        patient =
          await tx.patient.findFirst({
            where: {
              clinicId:
                data.clinicId,
              firstName,
              lastName,
            },
          });
      }

      if (!patient) {
        const clinic =
          await tx.clinic.update({
            where: {
              id: data.clinicId,
            },
            data: {
              mrnCounter: {
                increment: 1,
              },
            },
            select: {
              code: true,
              mrnCounter: true,
            },
          });

        const mrn = `${clinic.code}-${String(
          clinic.mrnCounter
        ).padStart(5, "0")}`;

        patient =
          await tx.patient.create({
            data: {
              clinicId:
                data.clinicId,
              mrn,
              firstName,
              lastName,
              phone:
                identifier || null,
              nationalId:
                identifier || null,
              gender: "unknown",
              dateOfBirth:
                new Date(
                  "2000-01-01"
                ),
            },
          });
      }

      const unit =
        await tx.unit.findFirst({
          where: {
            clinicId:
              data.clinicId,
            name: data.ward,
          },
        });

      if (!unit) {
        throw new Error(
          "Selected ward/unit not found"
        );
      }

      const existingBed =
        await tx.inpatientStay.findFirst({
          where: {
            clinicId:
              data.clinicId,
            unitId: unit.id,
            bedCode: data.bed,
            dischargedAt: null,
          },
        });

      if (existingBed) {
        throw new Error(
          "Bed already occupied"
        );
      }

      const encounter =
        await tx.encounter.create({
          data: {
            clinicId:
              data.clinicId,
            patientId:
              patient.id,
            type: "inpatient",
            status: "open",
            startedAt:
              admittedAt,
          },
        });

      const stay =
        await tx.inpatientStay.create({
          data: {
            clinicId:
              data.clinicId,
            patientId:
              patient.id,
            encounterId:
              encounter.id,
            unitId: unit.id,
            bedCode: data.bed,
            team: data.team,
            admittedAt,
            ews: data.ews
              ? Number(data.ews)
              : null,
          },
        });

      if (data.ews) {
        await tx.clinicalParameterEntry.create({
          data: {
            encounterId:
              encounter.id,
            name: "NEWS2",
            value: String(
              data.ews
            ),
          },
        });
      }

      return stay;
    }
  );
};