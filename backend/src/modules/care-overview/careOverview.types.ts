export type CareContactCategory =
  | "inpatient"
  | "outpatient"
  | "multiple"
  | "secrecy"
  | "none";

export type CareContactEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  category: CareContactCategory;

  visitType: string;
  unit: string;
  responsible: string;
  role: string;
};
