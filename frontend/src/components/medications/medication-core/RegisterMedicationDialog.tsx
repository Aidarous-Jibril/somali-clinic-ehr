import { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import {
  medicationFormSchema,
  type MedicationFormValues,
  medicationFrequencyOptions,
  medicationGroupOptions,
} from "../../../schemas/medication.schema";
import { useCreateMedication } from "../../../hooks/medications/useCreateMedication";



interface RegisterMedicationDialogProps {
  open: boolean;
  patientId: string;
  encounterId?: string;
  onClose: () => void;
  onSuccess?: () => void;
  initialValues?: Partial<MedicationFormValues>;
}

export function RegisterMedicationDialog({ open, patientId, encounterId, onClose, onSuccess, initialValues }: RegisterMedicationDialogProps) {
  const createMutation = useCreateMedication();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationFormSchema),
    defaultValues: {
      patientId,
      encounterId,
      name: "",
      strength: "",
      dose: "",
      frequency: "once_daily",
      groupType: "current",
      dosingText: "",
      indication: "",
      ...initialValues,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        patientId,
        encounterId,
        name: "",
        strength: "",
        dose: "",
        frequency: "once_daily",
        groupType: "current",
        dosingText: "",
        indication: "",
        ...initialValues,
      });
    }
  }, [open, patientId, encounterId, reset]);

  const onSubmit = async ( values: MedicationFormValues ) => {
    try {
      const result = await createMutation.mutateAsync(values);

      toast.success( result?.message || "Medication registered successfully");

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);

      toast.error( "Failed to register medication" );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Register Medication</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Medication name"
              fullWidth
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <TextField
              label="Strength"
              fullWidth
              {...register("strength")}
            />

            <TextField
              label="Dose"
              fullWidth
              {...register("dose")}
              error={!!errors.dose}
              helperText={errors.dose?.message}
            />

            <TextField
              select
              label="Frequency"
              fullWidth
              defaultValue="once_daily"
              {...register("frequency")}
              error={!!errors.frequency}
              helperText={errors.frequency?.message}
            >
              {medicationFrequencyOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Group"
              fullWidth
              defaultValue="current"
              {...register("groupType")}
              error={!!errors.groupType}
              helperText={errors.groupType?.message}
            >
              {medicationGroupOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Dosing text"
              fullWidth
              placeholder="e.g. 1 tablet twice daily"
              {...register("dosingText")}
            />

            <div className="md:col-span-2">
              <TextField
                label="Indication"
                fullWidth
                multiline
                minRows={3}
                {...register("indication")}
              />
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={onClose}
            disabled={isSubmitting || createMutation.isPending}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || createMutation.isPending}
          >
            {createMutation.isPending
              ? "Saving..."
              : "Register Medication"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}