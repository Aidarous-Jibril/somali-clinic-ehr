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

import type { RadiologyResult } from "../types";

type Props = {
  open: boolean;
  onClose: () => void;
  result: RadiologyResult | null;
};

const RadiologyReportDialog = ({
  open,
  onClose,
  result,
}: Props) => {
    console.log("result:", result)
  if (!result) return null;

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
        {result.examination}

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Examination
            </Typography>

            <Typography>
              {result.examination}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Modality
            </Typography>

            <Typography>
              {result.modality}
            </Typography>
          </Grid>

          <Grid size={12}>
            <Divider />
          </Grid>

          <Grid size={12}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Impression
            </Typography>

            <Typography>
              {result.impression}
            </Typography>
          </Grid>

          <Grid size={12}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Findings
            </Typography>

            <Typography>
              {result.findings || "-"}
            </Typography>
          </Grid>

          <Grid size={12}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Comment
            </Typography>

            <Typography>
              {result.comment || "-"}
            </Typography>
          </Grid>

          <Grid size={12}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Overall Result
            </Typography>

            <br />

            <Chip
              label={result.overallResult}
              color={
                result.overallResult === "normal"
                  ? "success"
                  : "error"
              }
              size="small"
            />
          </Grid>

          <Grid size={12}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Images
            </Typography>

            {result.images.length === 0 ? (
              <Typography>
                No images uploaded.
              </Typography>
            ) : (
              result.images.map((image) => (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {result.images.map((image) => (
              <img
                key={image.id}
                src={`http://localhost:3000/${image.filePath}`}
                alt={image.viewName || image.fileName}
                className="h-32 w-full rounded border object-cover cursor-pointer hover:opacity-90 transition"
              />
            ))}
          </div>
              ))
            )}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default RadiologyReportDialog;