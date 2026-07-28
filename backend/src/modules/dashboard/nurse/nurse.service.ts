import * as repo from "./nurse.repository.js";

export const getNurseAssignedPatients = async (unitId: string) => {
  const patients = await repo.getAssignedPatients(unitId);

  return patients.map((stay) => ({
    stayId: stay.id,
    patientId: stay.patient.id,
    mrn: stay.patient.mrn,
    firstName: stay.patient.firstName,
    lastName: stay.patient.lastName,
    phone: stay.patient.phone,
    gender: stay.patient.gender,
    bedCode: stay.bedCode,
    admittedAt: stay.admittedAt,
    encounterId: stay.encounterId,
    ews: stay.ews,
  }));
};

export const getNurseMedicationDueNow = async (unitId: string) => {
  const doses = await repo.getMedicationDueNow(unitId);

  const unique = new Map();

  doses.forEach((dose) => {
    unique.set(dose.medication.patient.id, {
      id: dose.medication.patient.id,
      mrn: dose.medication.patient.mrn,
      firstName: dose.medication.patient.firstName,
      lastName: dose.medication.patient.lastName,
      phone: dose.medication.patient.phone,
      gender: dose.medication.patient.gender,
    });
  });

  return [...unique.values()];
};

export const getNurseVitalsOverdue = async (unitId: string) => {
  const stays = await repo.getActiveStaysWithLatestVitals(unitId);

  const now = new Date();

  return stays
    .map((stay) => {
      const latest =
        stay.encounter?.clinicalParameterEntries?.[0];

      // No vitals at all = overdue
      if (!latest) {
        return {
          stayId: stay.id,
          patientId: stay.patient.id,
          mrn: stay.patient.mrn,
          firstName: stay.patient.firstName,
          lastName: stay.patient.lastName,
          phone: stay.patient.phone,
          gender: stay.patient.gender,
          ews: stay.ews ?? 0,
          lastVitalsAt: null,
          dueAt: null,
          overdue: true,
        };
      }

      // IMPORTANT FIX
      const ews = Number(
        latest.value ?? stay.ews ?? 0
      );

      let dueHours = 8;

      if (ews >= 5) dueHours = 1;
      else if (ews >= 3) dueHours = 4;

      const dueAt = new Date(
        latest.recordedAt.getTime() +
          dueHours * 60 * 60 * 1000
      );

      const overdue = now > dueAt;
      return {
        stayId: stay.id,
        patientId: stay.patient.id,
        mrn: stay.patient.mrn,
        firstName: stay.patient.firstName,
        lastName: stay.patient.lastName,
        phone: stay.patient.phone,
        gender: stay.patient.gender,
        ews,
        lastVitalsAt: latest.recordedAt,
        dueAt,
        overdue,
      };
    })
    .filter((x) => x.overdue);
};

export const getNurseFluidAlerts = async (unitId: string) => {
  const stays = await repo.getActiveStaysWithFluidBalances(unitId);

  const now = new Date();

  const last24Hours = new Date( now.getTime() - 24 * 60 * 60 * 1000 );

  return stays
    .map((stay) => {
      const entries =
        stay.encounter?.fluidBalanceEntries ?? [];

      // --------------------------------
      // Never charted
      // --------------------------------
      if (entries.length === 0) {
        return {
          stayId: stay.id,
          patientId: stay.patient.id,
          mrn: stay.patient.mrn,
          firstName: stay.patient.firstName,
          lastName: stay.patient.lastName,
          phone: stay.patient.phone,
          gender: stay.patient.gender,
          alertType: "missing_chart",
          measuredAt: null,
          balanceMl: null,
        };
      }

      // newest entry
      const latest = entries[0];

      const hoursSinceLast =
        (now.getTime() - latest.measuredAt.getTime()) /
        (1000 * 60 * 60);

      // --------------------------------
      // Chart overdue
      // --------------------------------
      if (hoursSinceLast > 8) {
        return {
          stayId: stay.id,
          patientId: stay.patient.id,
          mrn: stay.patient.mrn,
          firstName: stay.patient.firstName,
          lastName: stay.patient.lastName,
          phone: stay.patient.phone,
          gender: stay.patient.gender,
          alertType: "chart_overdue",
          measuredAt: latest.measuredAt,
          balanceMl: null,
        };
      }

      // --------------------------------
      // Last 24 hours
      // --------------------------------
      const last24hEntries = entries.filter(
        (entry) => entry.measuredAt >= last24Hours
      );

      let totalIntake = 0;
      let totalOutput = 0;

      for (const entry of last24hEntries) {
        const d = entry.details;

        totalIntake +=
          (d?.oralMl ?? 0) +
          (d?.enteralMl ?? 0);

        totalOutput +=
          (d?.urineMl ?? 0) +
          (d?.bleedingMl ?? 0) +
          (d?.faecesMl ?? 0) +
          (d?.vomitingMl ?? 0);
      }

      const balance = totalIntake - totalOutput;

      // --------------------------------
      // Negative balance
      // --------------------------------
      if (balance <= -500) {
        return {
          stayId: stay.id,
          patientId: stay.patient.id,
          mrn: stay.patient.mrn,
          firstName: stay.patient.firstName,
          lastName: stay.patient.lastName,
          phone: stay.patient.phone,
          gender: stay.patient.gender,
          alertType: "negative_balance",
          measuredAt: latest.measuredAt,
          balanceMl: balance,
        };
      }

      // --------------------------------
      // Fluid overload
      // --------------------------------

      if (balance >= 1000) {
        return {
          stayId: stay.id,
          patientId: stay.patient.id,
          mrn: stay.patient.mrn,
          firstName: stay.patient.firstName,
          lastName: stay.patient.lastName,
          phone: stay.patient.phone,
          gender: stay.patient.gender,
          alertType: "fluid_overload",
          measuredAt: latest.measuredAt,
          balanceMl: balance,
        };
      }

      return null;
    })
    .filter(Boolean);
};
export const getNursePendingReferrals = async (unitId: string) => {
  const referrals = await repo.getPendingReferralsForUnit(unitId);

  return referrals.map((ref) => ({
    referralId: ref.id,
    patientId: ref.patient.id,
    mrn: ref.patient.mrn,
    firstName: ref.patient.firstName,
    lastName: ref.patient.lastName,
    phone: ref.patient.phone,
    gender: ref.patient.gender,
    status: ref.status,
    urgent: ref.urgent,
    fromClinic: ref.fromClinic?.name ?? null,
    fromUnit: ref.fromUnit?.name ?? null,
    createdAt: ref.createdAt,
  }));
};

export const getNurseWardOccupancy = async (unitId: string) => {
  const unit = await repo.getWardOccupancy(unitId);

  if (!unit) return null;

  const occupiedBeds = new Set(
    unit.inpatientStays.map((stay) => stay.bedCode)
  ).size;

  const totalBeds = unit.bedCapacity ?? 0;
  const freeBeds = totalBeds - occupiedBeds;

  const occupancyRate =
    totalBeds > 0
      ? Math.round((occupiedBeds / totalBeds) * 100)
      : null;

  return {
    unitId: unit.id,
    unitName: unit.name,
    totalBeds,
    occupiedBeds,
    freeBeds,
    occupancyRate,
    occupiedPatients: unit.inpatientStays.map((stay) => ({
      stayId: stay.id,
      patientId: stay.patient.id,
      mrn: stay.patient.mrn,
      firstName: stay.patient.firstName,
      lastName: stay.patient.lastName,
      phone: stay.patient.phone,
      gender: stay.patient.gender,
      bedCode: stay.bedCode,
      admittedAt: stay.admittedAt,
    })),
  };
};
