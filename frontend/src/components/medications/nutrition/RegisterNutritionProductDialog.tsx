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
  nutritionProductFormSchema,
  type NutritionProductFormValues,
} from "../../../schemas/nutrition-product.schema";

import { useCreateNutritionProduct } from "../../../hooks/medications/useCreateNutritionProduct";
import { nutritionProductAreaOptions } from "../../../features/medications/constants";
import { useAuth } from "../../../context/AuthContext";

interface RegisterNutritionProductDialogProps {
  open: boolean;
  patientId: string;
  encounterId?: string;
  onClose: () => void;
}

export function RegisterNutritionProductDialog({
  open,
  patientId,
  encounterId,
  onClose,
}: RegisterNutritionProductDialogProps) {
  const { user } = useAuth();
  const prescriberName = user?.name ?? "";

  const createMutation =
    useCreateNutritionProduct(patientId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NutritionProductFormValues>({
    resolver: zodResolver(
      nutritionProductFormSchema
    ),
    defaultValues: {
      patientId,
      encounterId,
      productName: "",
      description: "",
      articleNo: "",
      productArea: nutritionProductAreaOptions[0],
      prescribedAt: new Date()
        .toISOString()
        .slice(0, 10),
      validUntil: "",
      prescriber: prescriberName,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        patientId,
        encounterId,
        productName: "",
        description: "",
        articleNo: "",
        productArea:
          nutritionProductAreaOptions[0],
        prescribedAt: new Date()
          .toISOString()
          .slice(0, 10),
        validUntil: "",
        prescriber: prescriberName,
      });
    }
  }, [
    open,
    patientId,
    encounterId,
    prescriberName,
    reset,
  ]);

  const onSubmit = async ( values: NutritionProductFormValues ) => {
    try {
        const result = await createMutation.mutateAsync(values);
        toast.success(result.message);

        onClose();
    } catch (error) {
        console.error(error);

        toast.error(
        "Failed to register nutrition product"
        );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        Register Nutrition Product
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Product name"
              fullWidth
              {...register("productName")}
              error={!!errors.productName}
              helperText={
                errors.productName?.message
              }
            />

            <TextField
              label="Article number"
              fullWidth
              {...register("articleNo")}
            />

            <TextField
              select
              label="Product area"
              fullWidth
              defaultValue={
                nutritionProductAreaOptions[0]
              }
              {...register("productArea")}
              error={!!errors.productArea}
              helperText={
                errors.productArea?.message
              }
            >
              {nutritionProductAreaOptions.map(
                (option) => (
                  <MenuItem
                    key={option}
                    value={option}
                  >
                    {option}
                  </MenuItem>
                )
              )}
            </TextField>

            <TextField
              label="Prescriber"
              fullWidth
              value={prescriberName}
              disabled
            />

            <TextField
              label="Prescribed date"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              {...register("prescribedAt")}
            />

            <TextField
              label="Valid until"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              {...register("validUntil")}
            />

            <div className="md:col-span-2">
              <TextField
                label="Description"
                fullWidth
                multiline
                minRows={3}
                {...register("description")}
              />
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={onClose}
            disabled={
              isSubmitting ||
              createMutation.isPending
            }
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={
              isSubmitting ||
              createMutation.isPending
            }
          >
            {createMutation.isPending
              ? "Saving..."
              : "Register Nutrition Product"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}