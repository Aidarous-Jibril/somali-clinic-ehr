import { Card, CardContent, Typography, Stack, Chip } from "@mui/material";
import type { Encounter } from "../../features/patient-overview/types";

type Props = {
  encounter?: Encounter;
};

export const EncounterHeader = ({ encounter }: Props) => {
  if (!encounter) return null;

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="subtitle2" color="text.secondary">
            Active encounter
          </Typography>

          <Typography variant="h6">
            {encounter.type.toUpperCase()}
          </Typography>

          <Typography variant="body2">
            Reason: {encounter.reason || "Not specified"}
          </Typography>

          <Typography variant="body2">
            Started: {new Date(encounter.startedAt).toLocaleString()}
          </Typography>

          <Stack direction="row" spacing={1}>
            <Chip
              label={encounter.status.toUpperCase()}
              color={encounter.status === "open" ? "success" : "default"}
              size="small"
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
