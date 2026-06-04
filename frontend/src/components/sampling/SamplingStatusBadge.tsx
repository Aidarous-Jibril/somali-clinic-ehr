import React from "react";
import { Chip } from "@mui/material";

type Props = {
  status: string;
};

const colorMap: Record<
  string,
  "default" | "primary" | "success" | "warning" | "error"
> = {
  registered: "default",
  collected: "primary",
  received: "primary",
  processing: "warning",
  completed: "success",
  rejected: "error",
};

const SamplingStatusBadge: React.FC<Props> = ({
  status,
}) => {
  return (
    <Chip
      label={status}
      color={colorMap[status] || "default"}
      size="small"
    />
  );
};

export default SamplingStatusBadge;