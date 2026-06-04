import React, { useState } from "react";

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
} from "@mui/material";

type Props = {
  open: boolean;

  onClose: () => void;

  onConfirm: (opts: {
    printRequisition: boolean;
    printLabels: boolean;
  }) => void;
};

const PrintDialog: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [printRequisition, setPrintRequisition] =
    useState(true);

  const [printLabels, setPrintLabels] =
    useState(true);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>
        Print
      </DialogTitle>

      <DialogContent>
        <Stack sx={{ mt: 1 }} spacing={1}>
          <FormControlLabel
            control={
              <Checkbox
                checked={printRequisition}
                onChange={(e) =>
                  setPrintRequisition(
                    e.target.checked
                  )
                }
              />
            }
            label="Print sampling requisition"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={printLabels}
                onChange={(e) =>
                  setPrintLabels(
                    e.target.checked
                  )
                }
              />
            }
            label="Print labels"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={() =>
            onConfirm({
              printRequisition,
              printLabels,
            })
          }
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrintDialog;