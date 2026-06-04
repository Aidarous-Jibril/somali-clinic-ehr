// components/common/AddButton.tsx

import { IconButton, Tooltip } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useAuth } from "../../../context/AuthContext";

export const AddButton = ({ onClick, title }: { onClick: () => void; title: string }) => {
  const { user } = useAuth();

  if (user?.role !== "Doctor") return null;

  return (
    <Tooltip title={title}>
      <IconButton size="small" sx={{ color: "#1d4ed8" }} onClick={onClick}>
        <AddCircleOutlineIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};