import api from "../api/client";

/* Encounters for patient */
export const getJournalEncounters = async (patientId: string) => {
  const res = await api.get(`/encounters`, {
    params: { patientId },
  });

  return res.data;
};

/* Staff in current clinic */
export const getJournalStaff = async () => {
  const res = await api.get(`/staff`);
  return res.data;
};

/* Units in current clinic */
export const getJournalUnits = async () => {
  const res = await api.get(`/units`);
  return res.data;
};