import { useQuery } from "@tanstack/react-query";
import { getClinics } from "../../api/clinic.api";

export const useClinics = () =>
  useQuery({
    queryKey: ["clinics"],
    queryFn: getClinics,
  });
