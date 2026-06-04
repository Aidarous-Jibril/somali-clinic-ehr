import * as repo from "./clinic.repository.js";

export const createClinic = (data: { name: string; code: string; }) => {
  return repo.createClinic(data);
};

export const listClinics = () => {
  return repo.findAll();
};