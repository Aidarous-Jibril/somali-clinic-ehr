//prisma/seeders/sch.seeder.ts
import { prisma } from "../../src/config/prisma.js";
import { hashedPassword } from "./shared/passwords.js";

import {
  ReferralRole,
  OrderCategory,
  OrderStatus,
  Gender,
  EncounterType,
  UnitType,
  MedicationFrequency,
  MedicationRoute,
  PurchaseStatus,
} from "@prisma/client";

export async function seedSCH() {
  console.log("🏥 Seeding Somali Central Hospital...");
  //
  // ------------------------------------------------------------
  // CLINIC
  // ------------------------------------------------------------
  //

  const sch = await prisma.clinic.create({
    data: {
      code: "SCH",
      name: "Somali Central Hospital",
    },
  });

  //
  // ------------------------------------------------------------
  // UNITS
  // ------------------------------------------------------------
  //

  const emergencySCH = await prisma.unit.create({
    data: {
      clinicId: sch.id,
      name: "Emergency",
      type: UnitType.emergency,
      bedCapacity: 20,
    },
  });

  const cardiologySCH = await prisma.unit.create({
    data: {
      clinicId: sch.id,
      name: "Cardiology",
      type: UnitType.ward,
      bedCapacity: 15,
    },
  });

  const laboratorySCH = await prisma.unit.create({
    data: {
      clinicId: sch.id,
      name: "Laboratory",
      type: UnitType.lab,
      bedCapacity: 10,
    },
  });

  const radiologySCH = await prisma.unit.create({
    data: {
      clinicId: sch.id,
      name: "Radiology",
      type: UnitType.radiology,
      bedCapacity: 5,
    },
  });

  const pharmacySCH = await prisma.unit.create({
    data: {
      clinicId: sch.id,
      name: "Pharmacy",
      type: UnitType.pharmacy,
      bedCapacity: 0,
    },
  });

  //
  // ------------------------------------------------------------
  // TEAMS
  // ------------------------------------------------------------
  //

  const emergencyTeamSCH = await prisma.team.create({
    data: {
      clinicId: sch.id,
      unitId: emergencySCH.id,
      name: "Emergency Team A",
    },
  });

  const cardiologyTeamSCH = await prisma.team.create({
    data: {
      clinicId: sch.id,
      unitId: cardiologySCH.id,
      name: "Cardiology Team A",
    },
  });

  const laboratoryTeamSCH = await prisma.team.create({
    data: {
      clinicId: sch.id,
      unitId: laboratorySCH.id,
      name: "Laboratory Team A",
    },
  });

  const radiologyTeamSCH = await prisma.team.create({
    data: {
      clinicId: sch.id,
      unitId: radiologySCH.id,
      name: "Radiology Team A",
    },
  });

  const pharmacyTeamSCH = await prisma.team.create({
    data: {
      clinicId: sch.id,
      unitId: pharmacySCH.id,
      name: "Pharmacy Team A",
    },
  });

  //
  // ------------------------------------------------------------
  // CLINIC ADMIN
  // ------------------------------------------------------------
  //

  const clinicAdminPerson = await prisma.staffPerson.create({
    data: {
      firstName: "Clinic",
      lastName: "Administrator",
      licenseNumber: "ADMIN002",
    },
  });

  const clinicAdminAccount = await prisma.staffAccount.create({
    data: {
      personId: clinicAdminPerson.id,
      clinicId: sch.id,
      email: "admin@sch.so",
      password: hashedPassword,
    },
  });

  await prisma.staffAssignment.create({
    data: {
      accountId: clinicAdminAccount.id,
      role: ReferralRole.ClinicAdmin,
    },
  });

  //
  // ------------------------------------------------------------
  // DOCTOR
  // ------------------------------------------------------------
  //

  const doctorPerson = await prisma.staffPerson.create({
    data: {
      firstName: "Ahmed",
      lastName: "Ali",
      licenseNumber: "DOC002",
    },
  });

  const doctorAccount = await prisma.staffAccount.create({
    data: {
      personId: doctorPerson.id,
      clinicId: sch.id,
      email: "doctor@sch.so",
      password: hashedPassword,
    },
  });

  await prisma.staffAssignment.create({
    data: {
      accountId: doctorAccount.id,
      unitId: cardiologySCH.id,
      teamId: cardiologyTeamSCH.id,
      role: ReferralRole.Doctor,
    },
  });

  //
  // ------------------------------------------------------------
  // NURSE
  // ------------------------------------------------------------
  //

  const nursePerson = await prisma.staffPerson.create({
    data: {
      firstName: "Hodan",
      lastName: "Nur",
      licenseNumber: "NUR002",
    },
  });

  const nurseAccount = await prisma.staffAccount.create({
    data: {
      personId: nursePerson.id,
      clinicId: sch.id,
      email: "nurse@sch.so",
      password: hashedPassword,
    },
  });

  await prisma.staffAssignment.create({
    data: {
      accountId: nurseAccount.id,
      unitId: emergencySCH.id,
      teamId: emergencyTeamSCH.id,
      role: ReferralRole.Nurse,
    },
  });

  //
  // ------------------------------------------------------------
  // LABORATORY
  // ------------------------------------------------------------
  //

  const labPerson = await prisma.staffPerson.create({
    data: {
      firstName: "Lab",
      lastName: "Technician",
      licenseNumber: "SCH-LAB001",
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
      teamId: laboratoryTeamSCH.id,
      role: ReferralRole.Lab,
    },
  });

  //
  // ------------------------------------------------------------
  // RADIOLOGY
  // ------------------------------------------------------------
  //

  const radiologyPerson = await prisma.staffPerson.create({
    data: {
      firstName: "Abdi",
      lastName: "Radiology",
      licenseNumber: "RAD002",
    },
  });

  const radiologyAccount = await prisma.staffAccount.create({
    data: {
      personId: radiologyPerson.id,
      clinicId: sch.id,
      email: "radiology@sch.so",
      password: hashedPassword,
    },
  });

  await prisma.staffAssignment.create({
    data: {
      accountId: radiologyAccount.id,
      unitId: radiologySCH.id,
      teamId: radiologyTeamSCH.id,
      role: ReferralRole.Radiology,
    },
  });

  //
  // ------------------------------------------------------------
  // PHARMACIST
  // ------------------------------------------------------------
  //

  const pharmacistPerson = await prisma.staffPerson.create({
    data: {
      firstName: "Mohamed",
      lastName: "Pharmacist",
      licenseNumber: "PHA002",
    },
  });

  const pharmacistAccount = await prisma.staffAccount.create({
    data: {
      personId: pharmacistPerson.id,
      clinicId: sch.id,
      email: "pharmacy@sch.so",
      password: hashedPassword,
    },
  });

  await prisma.staffAssignment.create({
    data: {
      accountId: pharmacistAccount.id,
      unitId: pharmacySCH.id,
      teamId: pharmacyTeamSCH.id,
      role: ReferralRole.Pharmacist,
    },
  });
    //
  // ------------------------------------------------------------
  // PATIENT
  // ------------------------------------------------------------
  //

  const patient = await prisma.patient.create({
    data: {
      mrn: "20001",
      clinicId: sch.id,
      firstName: "Amina",
      lastName: "Hassan",
      gender: Gender.female,
      dateOfBirth: new Date("1988-08-15"),
    },
  });

  //
  // ------------------------------------------------------------
  // ENCOUNTER
  // ------------------------------------------------------------
  //

  const encounter = await prisma.encounter.create({
    data: {
      clinicId: sch.id,
      patientId: patient.id,
      type: EncounterType.inpatient,
      reason: "Chest pain observation",
    },
  });

  //
  // ------------------------------------------------------------
  // ORDER
  // ------------------------------------------------------------
  //

  await prisma.order.create({
    data: {
      clinicId: sch.id,
      patientId: patient.id,
      encounterId: encounter.id,

      category: OrderCategory.radiology,
      code: "XR-100",
      name: "Chest X-Ray",

      status: OrderStatus.ordered,

      orderedByAccountId: doctorAccount.id,
    },
  });

  //
  // ------------------------------------------------------------
  // SUPPLIERS
  // ------------------------------------------------------------
  //

  const supplier1 = await prisma.supplier.create({
    data: {
      clinicId: sch.id,
      name: "Som Pharma Ltd",
      phone: "+252611111111",
      email: "sales@sompharma.so",
      address: "Mogadishu",
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      clinicId: sch.id,
      name: "East Africa Medical Supplies",
      phone: "+252622222222",
      email: "info@eamed.so",
      address: "Mogadishu",
    },
  });

  //
  // ------------------------------------------------------------
  // MEDICATION PRODUCTS
  // ------------------------------------------------------------
  //

  const paracetamol = await prisma.medicationProduct.create({
    data: {
      clinicId: sch.id,
      name: "Paracetamol",
      genericName: "Paracetamol",
      strength: "500 mg",
      form: "Tablet",
      route: MedicationRoute.oral,
      manufacturer: "Som Pharma",
    },
  });

  const amoxicillin = await prisma.medicationProduct.create({
    data: {
      clinicId: sch.id,
      name: "Amoxicillin",
      genericName: "Amoxicillin",
      strength: "500 mg",
      form: "Capsule",
      route: MedicationRoute.oral,
      manufacturer: "Som Pharma",
    },
  });

  const ceftriaxone = await prisma.medicationProduct.create({
    data: {
      clinicId: sch.id,
      name: "Ceftriaxone",
      genericName: "Ceftriaxone",
      strength: "1 g",
      form: "Injection",
      route: MedicationRoute.intravenous,
      manufacturer: "East Africa Medical",
    },
  });

  const metformin = await prisma.medicationProduct.create({
    data: {
      clinicId: sch.id,
      name: "Metformin",
      genericName: "Metformin",
      strength: "500 mg",
      form: "Tablet",
      route: MedicationRoute.oral,
      manufacturer: "Som Pharma",
    },
  });

  const omeprazole = await prisma.medicationProduct.create({
    data: {
      clinicId: sch.id,
      name: "Omeprazole",
      genericName: "Omeprazole",
      strength: "20 mg",
      form: "Capsule",
      route: MedicationRoute.oral,
      manufacturer: "East Africa Medical",
    },
  });

  //
  // ------------------------------------------------------------
  // MEDICATION TEMPLATES
  // ------------------------------------------------------------
  //

  await prisma.medicationTemplate.createMany({
    data: [
      {
        clinicId: sch.id,
        templateName: "Paracetamol Pain",
        product: "Paracetamol",
        treatmentReason: "Pain",
        strength: "500 mg",
        dose: "1 tablet",
        dosing: "1 tablet x4",
        frequency: MedicationFrequency.four_times_daily,
        route: MedicationRoute.oral,
      },
      {
        clinicId: sch.id,
        templateName: "Amoxicillin Infection",
        product: "Amoxicillin",
        treatmentReason: "Infection",
        strength: "500 mg",
        dose: "1 capsule",
        dosing: "1 capsule x3",
        frequency: MedicationFrequency.three_times_daily,
        route: MedicationRoute.oral,
      },
      {
        clinicId: sch.id,
        templateName: "Ceftriaxone IV",
        product: "Ceftriaxone",
        treatmentReason: "Severe Infection",
        strength: "1 g",
        dose: "1 vial",
        dosing: "Once daily",
        frequency: MedicationFrequency.once_daily,
        route: MedicationRoute.intravenous,
      },
      {
        clinicId: sch.id,
        templateName: "Metformin Diabetes",
        product: "Metformin",
        treatmentReason: "Diabetes",
        strength: "500 mg",
        dose: "1 tablet",
        dosing: "1 tablet x2",
        frequency: MedicationFrequency.twice_daily,
        route: MedicationRoute.oral,
      },
      {
        clinicId: sch.id,
        templateName: "Omeprazole Gastritis",
        product: "Omeprazole",
        treatmentReason: "Gastritis",
        strength: "20 mg",
        dose: "1 capsule",
        dosing: "Once daily",
        frequency: MedicationFrequency.once_daily,
        route: MedicationRoute.oral,
      },
    ],
  });

  //
  // ------------------------------------------------------------
  // PURCHASES
  // ------------------------------------------------------------
  //

  const purchase1 = await prisma.purchase.create({
    data: {
      clinicId: sch.id,
      supplierId: supplier1.id,
      createdByAccountId: pharmacistAccount.id,
      status: PurchaseStatus.received,
      receivedAt: new Date(),
    },
  });

  const purchase2 = await prisma.purchase.create({
    data: {
      clinicId: sch.id,
      supplierId: supplier2.id,
      createdByAccountId: pharmacistAccount.id,
      status: PurchaseStatus.received,
      receivedAt: new Date(),
    },
  });

  //
  // ------------------------------------------------------------
  // PURCHASE ITEMS
  // ------------------------------------------------------------
  //

  await prisma.purchaseItem.createMany({
    data: [
      {
        purchaseId: purchase1.id,
        productId: paracetamol.id,
        quantity: 500,
        unitPrice: 0.05,
        batchNumber: "SCH-PAR-001",
        expiryDate: new Date("2028-12-31"),
      },
      {
        purchaseId: purchase1.id,
        productId: amoxicillin.id,
        quantity: 300,
        unitPrice: 0.20,
        batchNumber: "SCH-AMO-001",
        expiryDate: new Date("2028-10-31"),
      },
      {
        purchaseId: purchase2.id,
        productId: ceftriaxone.id,
        quantity: 200,
        unitPrice: 1.50,
        batchNumber: "SCH-CEF-001",
        expiryDate: new Date("2028-09-30"),
      },
      {
        purchaseId: purchase2.id,
        productId: metformin.id,
        quantity: 400,
        unitPrice: 0.08,
        batchNumber: "SCH-MET-001",
        expiryDate: new Date("2028-08-31"),
      },
      {
        purchaseId: purchase2.id,
        productId: omeprazole.id,
        quantity: 300,
        unitPrice: 0.15,
        batchNumber: "SCH-OME-001",
        expiryDate: new Date("2028-11-30"),
      },
    ],
  });

  //
  // ------------------------------------------------------------
  // INVENTORY
  // ------------------------------------------------------------
  //

  await prisma.medicationInventory.createMany({
    data: [
      {
        clinicId: sch.id,
        productId: paracetamol.id,
        supplierId: supplier1.id,
        batchNumber: "SCH-PAR-001",
        expiryDate: new Date("2028-12-31"),
        quantity: 500,
        minimumStock: 100,
        location: "Shelf A1",
      },
      {
        clinicId: sch.id,
        productId: amoxicillin.id,
        supplierId: supplier1.id,
        batchNumber: "SCH-AMO-001",
        expiryDate: new Date("2028-10-31"),
        quantity: 300,
        minimumStock: 60,
        location: "Shelf A2",
      },
      {
        clinicId: sch.id,
        productId: ceftriaxone.id,
        supplierId: supplier2.id,
        batchNumber: "SCH-CEF-001",
        expiryDate: new Date("2028-09-30"),
        quantity: 200,
        minimumStock: 40,
        location: "Cold Room",
      },
      {
        clinicId: sch.id,
        productId: metformin.id,
        supplierId: supplier2.id,
        batchNumber: "SCH-MET-001",
        expiryDate: new Date("2028-08-31"),
        quantity: 400,
        minimumStock: 80,
        location: "Shelf B1",
      },
      {
        clinicId: sch.id,
        productId: omeprazole.id,
        supplierId: supplier2.id,
        batchNumber: "SCH-OME-001",
        expiryDate: new Date("2028-11-30"),
        quantity: 300,
        minimumStock: 60,
        location: "Shelf B2",
      },
    ],
  });

  console.log("✅ SCH seeded");
}