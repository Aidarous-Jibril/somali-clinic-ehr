// src/pages/ConsentManagementLandingPage.tsx
import { Typography, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ConsentManagementLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Consent Management
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Search patient and manage consents
        </Typography>
      </div>

      <Paper className="p-6 rounded-lg">
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Quick actions
        </Typography>

        <div className="flex gap-3">
          <Button
            variant="contained"
            onClick={() => navigate("/patients")}
          >
            Search patient
          </Button>
        </div>
      </Paper>

      <Paper className="p-6 rounded-lg">
        <Typography variant="body2" color="text.secondary">
          Select a patient first to view and manage consents.
        </Typography>
      </Paper>
    </div>
  );
}