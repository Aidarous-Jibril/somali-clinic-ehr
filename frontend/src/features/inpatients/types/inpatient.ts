export type ActiveContact = {
  id: string;
  bedCode: string;
  ews: number | null;
  team: string | null;
  technicalUnit: string | null;
  activity: string | null;
  absence: string | null;
  admittedAt: string;
  plannedDischargeAt: string | null;
  plannedDischargeStatus: string | null;

  patient: {
    id: string;
    nationalId: string | null;
    firstName: string;
    lastName: string;
  };

  unit: {
    id: string;
    name: string;
  } | null;
};