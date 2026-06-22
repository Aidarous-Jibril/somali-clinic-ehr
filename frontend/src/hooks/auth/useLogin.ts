import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../../api/auth.api";

export const useLogin = () => {
  return useMutation({
   mutationFn: ({ clinicCode, email, password, }: {
    clinicCode: string;
    email: string;
    password: string;
  }) =>
    loginRequest(clinicCode, email, password),
  });
};
