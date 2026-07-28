//prisma/seeders/bnh.seeder.ts
import { prisma } from "../../src/config/prisma.js";
import {
  ReferralRole,
  OrderCategory,
  OrderStatus,
  Gender,
  EncounterType,
  UnitType,
  PurchaseStatus,
} from "@prisma/client";

import { hashedPassword } from "./shared/passwords.js";

export async function seedBNH() {
  //
  // CLINIC
  //
  const bnh = await prisma.clinic.create({
    data: {
      code: "BNH",
      name: "Benadir National Hospital",
    },
  });

  //
  // UNITS
  //
  const emergencyBNH = await prisma.unit.create({
    data: {
      clinicId: bnh.id,
      name: "Emergency",
      type: UnitType.emergency,
      bedCapacity: 20,
    },
  });

  const medicineBNH = await prisma.unit.create({
    data: {
      clinicId: bnh.id,
      name: "Medicine Ward",
      type: UnitType.ward,
      bedCapacity: 30,
    },
  });

  const laboratoryBNH = await prisma.unit.create({
    data: {
      clinicId: bnh.id,
      name: "Laboratory",
      type: UnitType.lab,
      bedCapacity: 10,
    },
  });

  const radiologyBNH = await prisma.unit.create({
    data: {
      clinicId: bnh.id,
      name: "Radiology",
      type: UnitType.radiology,
      bedCapacity: 5,
    },
  });

  const pharmacyBNH = await prisma.unit.create({
    data: {
      clinicId: bnh.id,
      name: "Pharmacy",
      type: UnitType.pharmacy,
      bedCapacity: 0,
    },
  });

  //
  // TEAMS
  //
  const emergencyTeamBNH = await prisma.team.create({
    data: {
      clinicId: bnh.id,
      unitId: emergencyBNH.id,
      name: "Emergency Team A",
    },
  });

  const medicineTeamBNH = await prisma.team.create({
    data: {
      clinicId: bnh.id,
      unitId: medicineBNH.id,
      name: "Medicine Team A",
    },
  });

  const laboratoryTeamBNH = await prisma.team.create({
    data: {
      clinicId: bnh.id,
      unitId: laboratoryBNH.id,
      name: "Laboratory Team A",
    },
  });

  const radiologyTeamBNH = await prisma.team.create({
    data: {
      clinicId: bnh.id,
      unitId: radiologyBNH.id,
      name: "Radiology Team A",
    },
  });

  const pharmacyTeamBNH = await prisma.team.create({
    data: {
      clinicId: bnh.id,
      unitId: pharmacyBNH.id,
      name: "Pharmacy Team A",
    },
  });

  //
  // SUPER ADMIN
  //
  const superAdminPerson = await prisma.staffPerson.create({
    data: {
      firstName: "System",
      lastName: "Administrator",
      licenseNumber: "SYS001",
    },
  });

  const superAdminAccount = await prisma.staffAccount.create({
    data: {
      personId: superAdminPerson.id,
      clinicId: bnh.id,
      email: "admin@ehr.so",
      password: hashedPassword,
    },
  });

  await prisma.staffAssignment.create({
    data: {
      accountId: superAdminAccount.id,
      role: ReferralRole.SuperAdmin,
    },
  });

  //
  // CLINIC ADMIN
  //
  const clinicAdminBNHPerson = await prisma.staffPerson.create({
    data: {
      firstName: "BNH",
      lastName: "Administrator",
      licenseNumber: "ADM001",
    },
  });

  const clinicAdminBNHAccount = await prisma.staffAccount.create({
    data: {
      personId: clinicAdminBNHPerson.id,
      clinicId: bnh.id,
      email: "admin@bnh.so",
      password: hashedPassword,
    },
  });

  await prisma.staffAssignment.create({
    data: {
      accountId: clinicAdminBNHAccount.id,
      unitId: emergencyBNH.id,
      teamId: emergencyTeamBNH.id,
      role: ReferralRole.ClinicAdmin,
    },
  });

  //
  // DOCTOR
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

  await prisma.staffAssignment.create({
    data: {
      accountId: doctorAccount.id,
      unitId: emergencyBNH.id,
      teamId: emergencyTeamBNH.id,
      role: ReferralRole.Doctor,
    },
  });

  //
  // NURSE
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
      teamId: emergencyTeamBNH.id,
      role: ReferralRole.Nurse,
    },
  });

  //
  // LABORATORY
  //
  const labBNHPerson = await prisma.staffPerson.create({
    data: {
      firstName: "Fatima",
      lastName: "Omar",
      licenseNumber: "BNH-LAB001",
    },
  });

  const labBNHAccount = await prisma.staffAccount.create({
    data: {
      personId: labBNHPerson.id,
      clinicId: bnh.id,
      email: "lab@bnh.so",
      password: hashedPassword,
    },
  });

  await prisma.staffAssignment.create({
    data: {
      accountId: labBNHAccount.id,
      unitId: laboratoryBNH.id,
      teamId: laboratoryTeamBNH.id,
      role: ReferralRole.Lab,
    },
  });

  //
  // RADIOLOGY
  //
  const radiologyPersonBNH = await prisma.staffPerson.create({
    data: {
      firstName: "Mohamed",
      lastName: "Radiology",
      licenseNumber: "RAD001",
    },
  });

  const radiologyAccountBNH = await prisma.staffAccount.create({
    data: {
      personId: radiologyPersonBNH.id,
      clinicId: bnh.id,
      email: "radiology@bnh.so",
      password: hashedPassword,
    },
  });

  await prisma.staffAssignment.create({
    data: {
      accountId: radiologyAccountBNH.id,
      unitId: radiologyBNH.id,
      teamId: radiologyTeamBNH.id,
      role: ReferralRole.Radiology,
    },
  });

  //
  // PHARMACIST
  //
  const pharmacistBNHPerson = await prisma.staffPerson.create({
    data: {
      firstName: "Ali",
      lastName: "Pharmacist",
      licenseNumber: "PHARM001",
    },
  });

  const pharmacistBNHAccount = await prisma.staffAccount.create({
    data: {
      personId: pharmacistBNHPerson.id,
      clinicId: bnh.id,
      email: "pharmacy@bnh.so",
      password: hashedPassword,
    },
  });

  await prisma.staffAssignment.create({
    data: {
      accountId: pharmacistBNHAccount.id,
      unitId: pharmacyBNH.id,
      teamId: pharmacyTeamBNH.id,
      role: ReferralRole.Pharmacist,
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

  //
  // ============================================================
  // PHARMACY
  // ============================================================
  //

  //
  // SUPPLIERS
  //
  const supplier1 = await prisma.supplier.create({
    data: {
      clinicId: bnh.id,
      name: "Somali Medical Supplies",
      phone: "+252610000001",
      email: "sales@somalimed.so",
      address: "Mogadishu",
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      clinicId: bnh.id,
      name: "Global Pharma Import",
      phone: "+252610000002",
      email: "orders@globalpharma.so",
      address: "Mogadishu",
    },
  });

  //
  // MEDICATION PRODUCTS
  //
  const paracetamol = await prisma.medicationProduct.create({
    data: {
      clinicId: bnh.id,
      name: "Paracetamol",
      genericName: "Paracetamol",
      strength: "500 mg",
      form: "Tablet",
      manufacturer: "GSK",
    },
  });

  const amoxicillin = await prisma.medicationProduct.create({
    data: {
      clinicId: bnh.id,
      name: "Amoxicillin",
      genericName: "Amoxicillin",
      strength: "500 mg",
      form: "Capsule",
      manufacturer: "Pfizer",
    },
  });

  const ceftriaxone = await prisma.medicationProduct.create({
    data: {
      clinicId: bnh.id,
      name: "Ceftriaxone",
      genericName: "Ceftriaxone",
      strength: "1 g",
      form: "Injection",
      manufacturer: "Roche",
    },
  });

  const metformin = await prisma.medicationProduct.create({
    data: {
      clinicId: bnh.id,
      name: "Metformin",
      genericName: "Metformin",
      strength: "500 mg",
      form: "Tablet",
      manufacturer: "Novo Nordisk",
    },
  });

  const omeprazole = await prisma.medicationProduct.create({
    data: {
      clinicId: bnh.id,
      name: "Omeprazole",
      genericName: "Omeprazole",
      strength: "20 mg",
      form: "Capsule",
      manufacturer: "AstraZeneca",
    },
  });

  //
  // MEDICATION TEMPLATES
  //
  await prisma.medicationTemplate.createMany({
    data: [
      {
        clinicId: bnh.id,
        templateName: "Paracetamol 500 mg",
        product: "Paracetamol",
        treatmentReason: "Pain / Fever",
        strength: "500 mg",
        dose: "1 tablet",
        frequency: "once_daily",
      },
      {
        clinicId: bnh.id,
        templateName: "Amoxicillin 500 mg",
        product: "Amoxicillin",
        treatmentReason: "Bacterial Infection",
        strength: "500 mg",
        dose: "1 capsule",
        frequency: "three_times_daily",
      },
      {
        clinicId: bnh.id,
        templateName: "Ceftriaxone 1 g",
        product: "Ceftriaxone",
        treatmentReason: "Severe Infection",
        strength: "1 g",
        dose: "1 vial",
        frequency: "once_daily",
      },
      {
        clinicId: bnh.id,
        templateName: "Metformin 500 mg",
        product: "Metformin",
        treatmentReason: "Diabetes",
        strength: "500 mg",
        dose: "1 tablet",
        frequency: "twice_daily",
      },
      {
        clinicId: bnh.id,
        templateName: "Omeprazole 20 mg",
        product: "Omeprazole",
        treatmentReason: "Gastritis / GERD",
        strength: "20 mg",
        dose: "1 capsule",
        frequency: "once_daily",
      },
    ],
  });

  //
  // PURCHASE
  //
  const purchase = await prisma.purchase.create({
    data: {
      clinicId: bnh.id,
      supplierId: supplier1.id,
      createdByAccountId: pharmacistBNHAccount.id,
      status: PurchaseStatus.received,
      receivedAt: new Date(),
    },
  });

  //
  // PURCHASE ITEMS
  //
  const purchaseItems = [
    {
      product: paracetamol,
      quantity: 1000,
      unitPrice: 0.10,
      batchNumber: "PARA001",
      expiryDate: new Date("2028-12-31"),
    },
    {
      product: amoxicillin,
      quantity: 500,
      unitPrice: 0.30,
      batchNumber: "AMOX001",
      expiryDate: new Date("2028-10-31"),
    },
    {
      product: ceftriaxone,
      quantity: 300,
      unitPrice: 1.50,
      batchNumber: "CEF001",
      expiryDate: new Date("2028-09-30"),
    },
    {
      product: metformin,
      quantity: 700,
      unitPrice: 0.20,
      batchNumber: "MET001",
      expiryDate: new Date("2028-11-30"),
    },
    {
      product: omeprazole,
      quantity: 600,
      unitPrice: 0.25,
      batchNumber: "OME001",
      expiryDate: new Date("2028-08-31"),
    },
  ];

  for (const item of purchaseItems) {
    await prisma.purchaseItem.create({
      data: {
        purchaseId: purchase.id,
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        batchNumber: item.batchNumber,
        expiryDate: item.expiryDate,
      },
    });

    await prisma.medicationInventory.create({
      data: {
        clinicId: bnh.id,
        productId: item.product.id,
        supplierId: supplier1.id,
        batchNumber: item.batchNumber,
        expiryDate: item.expiryDate,
        quantity: item.quantity,
        minimumStock: 100,
        location: "Main Pharmacy",
      },
    });
  }
}