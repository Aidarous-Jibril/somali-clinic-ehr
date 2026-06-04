//src/pages/LoginPage.tsx
import { Button, TextField, Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { useAuth } from "../context/AuthContext";
import { useLogin } from "../hooks/auth/useLogin";


// validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 chars"),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const loginMutation = useLogin();
  const { login, user } = useAuth();  
  const navigate = useNavigate();

  // REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm<LoginForm>({ resolver: zodResolver(loginSchema), });

  const onSubmit = async (data: LoginForm) => {
    try {
      const result = await loginMutation.mutateAsync(data);
       console.log("LOGIN RESPONSE:", result);   // 👈 ADD THIS

      login(result);
      navigate("/", { replace: true });
    } catch {
      alert("Invalid login");
    }
  };

  return (
    <Paper sx={{ maxWidth: 400, margin: "120px auto", padding: 4 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Typography variant="h6">Staff login</Typography>

          <TextField
            label="Email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Password"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Login
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default LoginPage;
