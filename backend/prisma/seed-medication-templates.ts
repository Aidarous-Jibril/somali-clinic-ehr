import {
  MedicationFrequency,
  MedicationGroupType,
} from "@prisma/client";

import { prisma } from "../src/config/prisma.js";

async function main() {
  console.log("🌱 Seeding medication templates...");

  // Find existing clinic
  const clinic = await prisma.clinic.findFirst({
    where: { code: "BNH" },
  });

  if (!clinic) {
    throw new Error(
      'Clinic with code "BNH" not found. Run the main seed first.'
    );
  }

  // Optional: clear existing templates for this clinic
  await prisma.medicationTemplate.deleteMany({
    where: {
      clinicId: clinic.id,
    },
  });

  // Create templates
  await prisma.medicationTemplate.createMany({
    data: [
      {
        clinicId: clinic.id,
        treatmentReason: "Pain",
        templateName: "Alvedon 500 mg",
        product: "Alvedon",
        form: "Film-coated tablet",
        strength: "500 mg",
        dosing: "2 tablets x 4 times daily for 10 days",
        name: "Alvedon",
        strengthValue: "500 mg",
        dose: "2 tablets x 4 times daily for 10 days",
        frequency: MedicationFrequency.once_daily,
        groupType: MedicationGroupType.current,
        dosingText: "2 tablets x 4 times daily for 10 days",
        indication: "Pain",
        recommended: true,
      },

      {
        clinicId: clinic.id,
        treatmentReason: "Vitamin D deficiency prevention",
        templateName: "Calcichew-D3 500 mg/400 IU",
        product: "Calcichew-D3",
        form: "Chewable tablet",
        strength: "500 mg/400 IU",
        dosing: "According to schedule",
        name: "Calcichew-D3",
        strengthValue: "500 mg/400 IU",
        dose: "According to schedule",
        frequency: MedicationFrequency.once_daily,
        groupType: MedicationGroupType.current,
        dosingText: "According to schedule",
        indication: "Vitamin D deficiency prevention",
        recommended: true,
      },

      {
        clinicId: clinic.id,
        treatmentReason: "Pain",
        templateName: "Morphine 5 mg",
        product: "Morphine",
        form: "Extended-release tablet",
        strength: "5 mg",
        dosing: "5 mg",
        name: "Morphine",
        strengthValue: "5 mg",
        dose: "5 mg",
        frequency: MedicationFrequency.as_needed,
        groupType: MedicationGroupType.current,
        dosingText: "5 mg",
        indication: "Pain",
        recommended: true,
      },

      {
        clinicId: clinic.id,
        treatmentReason: "Heart failure",
        templateName: "Enalapril 5 mg",
        product: "Enalapril",
        form: "Tablet",
        strength: "5 mg",
        dosing: "According to schedule",
        name: "Enalapril",
        strengthValue: "5 mg",
        dose: "According to schedule",
        frequency: MedicationFrequency.once_daily,
        groupType: MedicationGroupType.current,
        dosingText: "According to schedule",
        indication: "Heart failure",
        recommended: true,
      },

      {
        clinicId: clinic.id,
        treatmentReason: "Pain",
        templateName: "Paracetamol 1 g",
        product: "Paracetamol",
        form: "Tablet",
        strength: "1 g",
        dosing: "1 g",
        name: "Paracetamol",
        strengthValue: "1 g",
        dose: "1 g",
        frequency: MedicationFrequency.twice_daily,
        groupType: MedicationGroupType.current,
        dosingText: "1 g",
        indication: "Pain",
        recommended: true,
      },

      {
        clinicId: clinic.id,
        treatmentReason: "Pain",
        templateName: "Panadol 500 mg",
        product: "Panadol",
        form: "Tablet",
        strength: "500 mg",
        dosing: "500 mg",
        name: "Panadol",
        strengthValue: "500 mg",
        dose: "500 mg",
        frequency: MedicationFrequency.once_daily,
        groupType: MedicationGroupType.current,
        dosingText: "500 mg",
        indication: "Pain",
        recommended: true,
      },
    ],
  });

  console.log("✅ Medication templates seeded successfully");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });