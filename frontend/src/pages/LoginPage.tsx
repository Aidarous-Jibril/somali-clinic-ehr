import {
  Button,
  TextField,
  Paper,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { useAuth } from "../context/AuthContext";
import { useLogin } from "../hooks/auth/useLogin";
import { useClinics } from "../hooks/staff/useClinics";

// validation schema
const loginSchema = z.object({
  clinicCode: z.string().min(2, "Clinic code required"),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 chars"),
});

type LoginForm = z.infer<typeof loginSchema>;


const LoginPage = () => {
  const loginMutation = useLogin();
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const { data: clinics = [], isLoading } = useClinics();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      clinicCode: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const result = await loginMutation.mutateAsync(data);

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

          {/* Clinic Dropdown */}
          <FormControl fullWidth error={!!errors.clinicCode}>
            <InputLabel>Clinic</InputLabel>

            <Select
              value={watch("clinicCode")}
              label="Clinic"
              onChange={(e) => setValue("clinicCode", e.target.value)}
            >
              {clinics.map((clinic: any) => (
                <MenuItem key={clinic.code} value={clinic.code}>
                  {clinic.name} ({clinic.code})
                </MenuItem>
              ))}
            </Select>

            {errors.clinicCode && (
              <Typography variant="caption" color="error">
                {errors.clinicCode.message}
              </Typography>
            )}
          </FormControl>

          {/* Email */}
          <TextField
            label="Email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          {/* Password */}
          <TextField
            label="Password"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
          >
            Login
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default LoginPage;