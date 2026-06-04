import React from "react";

import {
  Button,
  Stack,
  TextField,
} from "@mui/material";
import type { SamplingWorklistItem } from "../../features/sampling/types";


type Props = {
  sample: SamplingWorklistItem | null;

  showExtended: boolean;

  onPrint: () => void;
};

const SamplingActions: React.FC<Props> = ({ sample, showExtended, onPrint, }) => {
    console.log("sample:", sample)
  return (
    <section className="rounded border border-gray-300 bg-white">
      <header className="border-b border-gray-200 px-3 py-2">
        <div className="text-[13px] font-semibold">
          Administrative
        </div>

        <div className="text-[11px] text-gray-500">
          Sample metadata
        </div>
      </header>

      <div className="p-3">
        {!sample ? (
          <div className="text-[11px] text-gray-500">
            Select a worklist item.
          </div>
        ) : (
          <Stack spacing={2}>
            <TextField
              label="Requester"
              size="small"
              value={sample.requester}
              disabled
            />

            <TextField
              label="Ordering unit"
              size="small"
              value={sample.orderingUnit}
              disabled
            />

            <TextField
              label="Order identity"
              size="small"
              value={sample.orderIdentity}
              disabled
            />

            <TextField
              label="Priority"
              size="small"
              value={sample.priority}
              disabled
            />

            <TextField
              label="Collected at"
              size="small"
              value={
                sample.collectedAt
                  ? new Date(
                      sample.collectedAt
                    ).toLocaleString()
                  : "-"
              }
              disabled
            />

            <TextField
              label="Received at"
              size="small"
              value={
                sample.receivedAt
                  ? new Date(
                      sample.receivedAt
                    ).toLocaleString()
                  : "-"
              }
              disabled
            />

            <TextField
              label="Processed at"
              size="small"
              value={
                sample.processedAt
                  ? new Date(
                      sample.processedAt
                    ).toLocaleString()
                  : "-"
              }
              disabled
            />

            <TextField
              label="Sampler comment"
              size="small"
              multiline
              minRows={3}
              value={
                sample.samplerComment ||
                ""
              }
              disabled={!showExtended}
            />

          </Stack>
        )}
      </div>
    </section>
  );
};

export default SamplingActions;