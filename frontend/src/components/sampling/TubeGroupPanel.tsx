import React from "react";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import type { TubeGroup } from "../../features/sampling/types";

type Props = {
  group: TubeGroup;
};

const TubeGroupPanel: React.FC<Props> = ({
  group,
}) => {
  return (
    <Accordion disableGutters>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography fontWeight={600}>
          {group.label}
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Stack spacing={1}>
          {group.analyses.map((analysis) => (
            <Typography
              key={analysis}
              variant="body2"
            >
              • {analysis}
            </Typography>
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default TubeGroupPanel;