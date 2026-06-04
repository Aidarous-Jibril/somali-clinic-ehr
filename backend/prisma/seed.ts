import { prisma } from "../src/config/prisma.js";
import bcrypt from "bcrypt";
import {
  ReferralRole,
  OrderCategory,
  OrderStatus,
  Gender,
  EncounterType,
} from "@prisma/client";

async function main() {
  console.log("🌱 Seeding hospital...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  //
  // CLINICS
  //
  const bnh = await prisma.clinic.create({
    data: {
      code: "BNH",
      name: "Benadir National Hospital",
    },
  });

  const sch = await prisma.clinic.create({
    data: {
      code: "SCH",
      name: "Somali Central Hospital",
    },
  });

  //
  // UNITS
  //
  const emergencyBNH = await prisma.unit.create({
    data: {
      clinicId: bnh.id,
      name: "Emergency",
    },
  });

  const medicineBNH = await prisma.unit.create({
    data: {
      clinicId: bnh.id,
      name: "Medicine Ward",
    },
  });

  const cardiologySCH = await prisma.unit.create({
    data: {
      clinicId: sch.id,
      name: "Cardiology",
    },
  });

  const laboratorySCH = await prisma.unit.create({
    data: {
      clinicId: sch.id,
      name: "Laboratory",
    },
  });

  //
  // TEAMS
  //
  const emergencyTeam = await prisma.team.create({
    data: {
      clinicId: bnh.id,
      unitId: emergencyBNH.id,
      name: "Emergency Team A",
    },
  });

  const medicineTeam = await prisma.team.create({
    data: {
      clinicId: bnh.id,
      unitId: medicineBNH.id,
      name: "Medicine Team A",
    },
  });

  const cardiologyTeam = await prisma.team.create({
    data: {
      clinicId: sch.id,
      unitId: cardiologySCH.id,
      name: "Cardiology Team A",
    },
  });

  const laboratoryTeam = await prisma.team.create({
    data: {
      clinicId: sch.id,
      unitId: laboratorySCH.id,
      name: "Laboratory Team A",
    },
  });

  //
  // DOCTOR - BNH
  //
  const doctorPerson = await prisma.staffPerson.create({
    data: {
      firstName: "Johan",
      lastName: "Svard",
      licenseNumber: "DOC001",
    },
  });

  const doctorAccount = await prisma.staffAccount.create({
    data: {
      personId: doctorPerson.id,
      clinicId: bnh.id,
      email: "doctor@bnh.so",
      password: hashedPassword,
    },
  });

  const doctorAssignment = await prisma.staffAssignment.create({
    data: {
      accountId: doctorAccount.id,
      unitId: emergencyBNH.id,
      teamId: emergencyTeam.id,
      role: ReferralRole.Doctor,
    },
  });

  //
  // NURSE - BNH
  //
  const nursePerson = await prisma.staffPerson.create({
    data: {
      firstName: "Ayaan",
      lastName: "Hassan",
      licenseNumber: "NUR001",
    },
  });

  const nurseAccount = await prisma.staffAccount.create({
    data: {
      personId: nursePerson.id,
      clinicId: bnh.id,
      email: "nurse@bnh.so",
      password: hashedPassword,
    },
  });

  await prisma.staffAssignment.create({
    data: {
      accountId: nurseAccount.id,
      unitId: emergencyBNH.id,
      teamId: emergencyTeam.id,
      role: ReferralRole.Nurse,
    },
  });

  //
  // DOCTOR - SCH
  //
  const doctor2Person = await prisma.staffPerson.create({
    data: {
      firstName: "Ahmed",
      lastName: "Ali",
      licenseNumber: "DOC002",
    },
  });

  const doctor2Account = await prisma.staffAccount.create({
    data: {
      personId: doctor2Person.id,
      clinicId: sch.id,
      email: "doctor@sch.so",
      password: hashedPassword,
    },
  });

  await prisma.staffAssignment.create({
    data: {
      accountId: doctor2Account.id,
      unitId: cardiologySCH.id,
      teamId: cardiologyTeam.id,
      role: ReferralRole.Doctor,
    },
  });

  //
  // LAB USER - SCH
  //
  const labPerson = await prisma.staffPerson.create({
    data: {
      firstName: "Lab",
      lastName: "Technician",
      licenseNumber: "LAB001",
    },
  });

  const labAccount = await prisma.staffAccount.create({
    data: {
      personId: labPerson.id,
      clinicId: sch.id,
      email: "lab@sch.so",
      password: hashedPassword,
    },
  });

  await prisma.staffAssignment.create({
    data: {
      accountId: labAccount.id,
      unitId: laboratorySCH.id,
      teamId: laboratoryTeam.id,
      role: ReferralRole.Lab,
    },
  });

  //
  // PATIENT
  //
  const patient = await prisma.patient.create({
    data: {
      mrn: "10001",
      clinicId: bnh.id,
      firstName: "Ali",
      lastName: "Mohamed",
      gender: Gender.male,
      dateOfBirth: new Date("1990-05-10"),
    },
  });

  //
  // ENCOUNTER
  //
  const encounter = await prisma.encounter.create({
    data: {
      clinicId: bnh.id,
      patientId: patient.id,
      type: EncounterType.inpatient,
      reason: "Observation",
    },
  });

  //
  // ORDER
  //
  await prisma.order.create({
    data: {
      clinicId: bnh.id,
      patientId: patient.id,
      encounterId: encounter.id,

      category: OrderCategory.radiology,
      code: "XR-001",
      name: "Chest X-Ray",

      status: OrderStatus.ordered,

      orderedByAccountId: doctorAccount.id,
    },
  });

  console.log("✅ Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });