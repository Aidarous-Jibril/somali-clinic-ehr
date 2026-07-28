import {
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import type { OrderResult } from "../types";
import { getLabMeta } from "../helpers";
import { formatDateTime } from "../../../utils/dateFormat";

type Props = {
  open: boolean;
  onClose: () => void;
  result: OrderResult | null;
};

const LaboratoryResultDialog = ({
  open,
  onClose,
  result,
}: Props) => {
  if (!result) return null;

  const meta = getLabMeta(result.name);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {result.name}

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" color="text.secondary">
              Analysis
            </Typography>

            <Typography>{result.name}</Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" color="text.secondary">
              Category
            </Typography>

            <Typography>{result.category}</Typography>
          </Grid>

          <Grid size={12}>
            <Divider />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" color="text.secondary">
              Result
            </Typography>

            <Typography variant="h6">{result.result}</Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" color="text.secondary">
              Unit
            </Typography>

            <Typography>{meta?.unit || "-"}</Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" color="text.secondary">
              Reference Range
            </Typography>

            <Typography>{meta?.ref || "-"}</Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" color="text.secondary">
              Result Flag
            </Typography>

            <br />

            <Chip
              size="small"
              label={result.flag}
              color={
                result.flag === "normal"
                  ? "success"
                  : result.flag === "low"
                  ? "warning"
                  : "error"
              }
            />
          </Grid>

          <Grid size={12}>
            <Typography variant="caption" color="text.secondary">
              Result Date
            </Typography>

            <Typography>{formatDateTime(result.date)}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default LaboratoryResultDialog;