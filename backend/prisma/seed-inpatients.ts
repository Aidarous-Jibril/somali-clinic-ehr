import { prisma } from "../src/config/prisma.js";

const main = async () => {
  console.log("🌱 Seeding inpatients...");

  // 1. Get existing clinic
  const clinic = await prisma.clinic.findFirst();

  if (!clinic) {
    throw new Error("No clinic found. Seed main system first.");
  }

  // 2. Get existing unit
  const unit = await prisma.unit.findFirst({
    where: { clinicId: clinic.id },
  });

  if (!unit) {
    throw new Error("No unit found.");
  }

  // Helper function
  const createPatientWithStay = async ({
    mrn,
    firstName,
    lastName,
    gender,
    nationalId,
    dob,
    bedCode,
    team,
    ews,
    admittedAt,
    plannedDischargeAt,
    plannedDischargeStatus,
    activity,
  }: any) => {
    const patient = await prisma.patient.create({
      data: {
        mrn,
        clinicId: clinic.id,
        firstName,
        lastName,
        gender,
        nationalId,
        dateOfBirth: new Date(dob),
      },
    });

    const encounter = await prisma.encounter.create({
      data: {
        clinicId: clinic.id,
        patientId: patient.id,
        type: "inpatient",
        status: "open",
        reason: "Ward admission",
      },
    });

    await prisma.inpatientStay.create({
      data: {
        clinicId: clinic.id,
        patientId: patient.id,
        encounterId: encounter.id,
        unitId: unit.id,
        bedCode,
        team,
        ews,
        admittedAt: new Date(admittedAt),
        plannedDischargeAt: plannedDischargeAt
          ? new Date(plannedDischargeAt)
          : null,
        plannedDischargeStatus,
        activity,
      },
    });
  };

  await createPatientWithStay({
    mrn: "20001",
    firstName: "Malin",
    lastName: "Sten",
    gender: "female",
    nationalId: "19900201-2384",
    dob: "1990-02-01",
    bedCode: "01:1",
    team: "Blue team",
    ews: 2,
    admittedAt: "2025-12-03T09:20:00",
    plannedDischargeAt: "2025-12-16T08:51:00",
  });

  await createPatientWithStay({
    mrn: "20002",
    firstName: "Gustaf",
    lastName: "Hedin",
    gender: "male",
    nationalId: "1930-09-04",
    dob: "1930-09-04",
    bedCode: "03:1",
    team: "Green team",
    ews: 4,
    admittedAt: "2025-11-28T10:30:00",
    plannedDischargeAt: "2025-12-16T15:10:00",
    plannedDischargeStatus: "done",
  });

  await createPatientWithStay({
    mrn: "20003",
    firstName: "Carina",
    lastName: "Stensjö",
    gender: "female",
    nationalId: "1939-08-22",
    dob: "1939-08-22",
    bedCode: "04:1",
    team: "Green team",
    ews: 6,
    admittedAt: "2025-12-01T11:00:00",
    plannedDischargeAt: "2025-12-15T08:56:00",
    plannedDischargeStatus: "warning",
    activity: "11:00",
  });

  console.log("✅ Inpatients seeded");
};

main()
  .catch((error) => {
    console.error("❌ Failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });