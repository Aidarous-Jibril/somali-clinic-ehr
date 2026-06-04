export const buildMedicationSections = (meds: any[]) => {
  return [
    {
      id: "currentMeds",
      title: "Current medication treatments",
      items: meds.filter(m => m.status === "active"),
    },
    {
      id: "pausedMeds",
      title: "Paused medication treatments",
      items: meds.filter(m => m.status === "paused"),
    },
    {
      id: "endedMeds",
      title: "Ended medication treatments",
      items: meds.filter(m => m.status === "ended"),
    },
  ];
};
