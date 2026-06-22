import { prisma } from "../../config/prisma.js";
import * as repo from "./referral.repository.js";
import { CreateReferralInput } from "./referral.schema.js";
import { ReferralStatus } from "@prisma/client";

export const createReferral = async ( input: CreateReferralInput ) => {
  const sourcePatient = await prisma.patient.findFirst({
    where: {
      id: input.patientId,
      clinicId: input.fromClinicId,
      isDeleted: false,
    },
  });

  if (!sourcePatient)  throw new Error( "Source patient not found" );
  
  if (input.encounterId) {
    const encounter = await prisma.encounter.findFirst({
      where: {
        id: input.encounterId,
        patientId: sourcePatient.id,
        clinicId: input.fromClinicId,
      },
    });

  if (!encounter) throw new Error("Invalid encounter"); }

  if (input.toUnitId === input.fromUnitId)
    throw new Error("Cannot refer to same unit");

  const toUnit = await prisma.unit.findUnique({
      where: { id: input.toUnitId, },
    });

  if (!toUnit) throw new Error( "Destination unit not found" );

  const targetClinicId = toUnit.clinicId;

  let targetPatient = await prisma.patient.findFirst({
      where: {
        clinicId: targetClinicId,

        OR: [
          sourcePatient.nationalId
            ? {
                nationalId:
                  sourcePatient.nationalId,
              }
            : undefined,

          {
            firstName: {
              equals:
                sourcePatient.firstName,
              mode: "insensitive",
            },

            lastName: {
              equals:
                sourcePatient.lastName,
              mode: "insensitive",
            },

            dateOfBirth: sourcePatient.dateOfBirth,
          },

          sourcePatient.phone
            ? {
                phone: sourcePatient.phone,
              }
            : undefined,
        ].filter(Boolean) as any,
      },
    });

  if (!targetPatient) {
    targetPatient = await prisma.$transaction(async (tx) => {
      const clinic = await tx.clinic.update({
        where: { id: targetClinicId },
        data: {
          mrnCounter: {
            increment: 1,
          },
        },
      });

      const mrn = `${clinic.code}-${String(clinic.mrnCounter).padStart(6, "0")}`;

      return tx.patient.create({
        data: {
          clinicId: targetClinicId,
          mrn,
          firstName: sourcePatient.firstName,
          lastName: sourcePatient.lastName,
          gender: sourcePatient.gender,
          dateOfBirth: sourcePatient.dateOfBirth,
          phone: sourcePatient.phone,
          email: sourcePatient.email,
          nationalId: sourcePatient.nationalId,
        },
      });
    });
  }
    const existing = await prisma.referral.findFirst({
      where: {
        patientId: targetPatient.id,
        toUnitId: input.toUnitId,
        status: {
          in: [
            ReferralStatus.unassessed,
            ReferralStatus.accepted,
            ReferralStatus.in_progress,
          ],
        },
      },
  });

  if (existing) 
    throw new Error("Active referral already exists");

  return repo.createReferral({
    ...input,
    clinicId: targetClinicId,
    patientId: targetPatient.id,
    sourcePatientId: sourcePatient.id,
    urgent: input.urgent ?? false,
    hasAdditionalInfo: input.hasAdditionalInfo ?? false,
  });
};

export const listByPatient = ( patientId: string, clinicId: string ) => {
  return repo.findByPatient( patientId, clinicId );
};

export const updateReferralStatus = async ( referralId: string, status: ReferralStatus, userUnitId: string ) => {
    const referral = await repo.findById( referralId);

    if (!referral) throw new Error( "Referral not found" );

    if ( referral.toUnitId !== userUnitId )  throw new Error( "Only receiving unit can update referral" );

    return repo.updateStatus( referralId, status);
  };

export const listIncoming = ( unitId: string ) => {
  return repo.findIncoming(unitId);
};

export const listOutgoing = ( unitId: string ) => {
  return repo.findOutgoing(unitId);
};