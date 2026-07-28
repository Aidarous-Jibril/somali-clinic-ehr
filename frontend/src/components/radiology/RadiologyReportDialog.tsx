//src/components/radiology/RadiologyReportDialog.tsx
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";

export type RadiologyOverallResult = | "normal" | "high" | "low" | "critical";

type Props = {
  open: boolean;
  order: any;
  onClose: () => void;
  onSubmit?: (payload: FormData) => Promise<void>;
};

const RadiologyReportDialog = ({
  open,
  order,
  onClose,
  onSubmit,
}: Props) => {
  const [impression, setImpression] = useState("");
  const [findings, setFindings] = useState("");
  const [comment, setComment] = useState("");
  const [overallResult, setOverallResult] = useState<RadiologyOverallResult>("normal");
  const [images, setImages] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    setImpression("");
    setFindings("");
    setComment("");
    setOverallResult("normal");
    setImages([]);
  }, [open]);

  const handleSubmit = async () => {
    if (!onSubmit) return;

    const formData = new FormData();

    formData.append("impression", impression);
    formData.append("findings", findings);
    formData.append("overallResult", overallResult);
    formData.append("comment", comment);

    images.forEach((file) => { formData.append("images", file);});

    try {
      setSaving(true);

      await onSubmit(formData);

      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        Radiology Report
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>

          <TextField
            label="Impression"
            value={impression}
            onChange={(e) =>
              setImpression(e.target.value)
            }
            required
            fullWidth
          />

          <TextField
            label="Findings"
            multiline
            rows={8}
            value={findings}
            onChange={(e) =>
              setFindings(e.target.value)
            }
            fullWidth
          />

          <TextField
            label="Comment"
            multiline
            rows={3}
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
            fullWidth
          />

          <TextField
            select
            label="Overall Result"
            value={overallResult}
            onChange={(e) =>
              setOverallResult(
                e.target.value as RadiologyOverallResult
              )
            }
            fullWidth
          >
            <MenuItem value="normal">
              Normal
            </MenuItem>

            <MenuItem value="low">
              Minor Finding
            </MenuItem>

            <MenuItem value="high">
              Abnormal
            </MenuItem>

            <MenuItem value="critical">
              Critical Finding
            </MenuItem>
          </TextField>

          <Button
            component="label"
            variant="outlined"
          >
            Upload Images

            <input
              hidden
              multiple
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (!e.target.files) return;

                setImages(
                  Array.from(e.target.files)
                );
              }}
            />
          </Button>

          {images.length > 0 && (
            <Stack spacing={0.5}>
              <Typography variant="subtitle2">
                Selected Images
              </Typography>
              
              {/* Later we'll replace this with thumbnails. */}
              {images.map((file) => (
                <Typography
                  key={file.name}
                  variant="body2"
                >
                  {file.name}
                </Typography>
              ))}
            </Stack>
          )}

        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          disabled={saving}
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={
            saving ||
            impression.trim() === ""
          }
          onClick={handleSubmit}
        >
          Submit Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RadiologyReportDialog;