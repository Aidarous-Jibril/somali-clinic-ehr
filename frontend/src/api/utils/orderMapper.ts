export const mapUiCategoryToBackend = (category: string) => {
  switch (category) {
    case "Chemistry":
    case "Hematology":
      return "chemistry";

    case "Microbiology":
      return "microbiology";

    case "Radiology":
      return "radiology";

    default:
      return "procedure";
  }
};
