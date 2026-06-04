import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../../api/auth.api";

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginRequest(email, password),
  });
};
