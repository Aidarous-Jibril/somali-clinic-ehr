export const buildVaccinationSections = (vaccinations: any[]) => {
  const mapItem = (v: any) => ({
    id: v.id,
    name: v.vaccineName,     
    strength: v.manufacturer || "",
    dose: v.dose || "",
    status: v.status,
    patientId: v.patientId,
    manufacturer: v.manufacturer,   
    administeredAt: v.administeredAt,
  });

  return [
    {
      id: "currentVacc",
      title: "Current vaccinations",
      items: vaccinations
        .filter(v => v.status === "active")
        .map(mapItem),
    },
    {
      id: "completedVacc",
      title: "Completed vaccinations",
      items: vaccinations
        .filter(v => v.status === "completed")
        .map(mapItem),
    },
    {
      id: "declinedVacc",
      title: "Declined vaccinations",
      items: vaccinations
        .filter(v => v.status === "declined")
        .map(mapItem),
    },
  ];
};
