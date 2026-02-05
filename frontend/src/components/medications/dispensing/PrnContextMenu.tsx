// src/components/medications/dispensing/PrnContextMenu.tsx
import { Menu, MenuItem } from "@mui/material";

export function PrnContextMenu({
  open,
  x,
  y,
  onClose,

  onAddDose,
  onPrepareDose,
  onAdministerDose,
}: {
  open: boolean;
  x: number;
  y: number;
  onClose: () => void;

  onAddDose: () => void;
  onPrepareDose: () => void;
  onAdministerDose: () => void;
}) {
  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={open ? { top: y, left: x } : undefined}
    >
      <MenuItem
        onClick={() => {
          onClose();
          onAddDose();
        }}
      >
        Add new dose…
      </MenuItem>

      <MenuItem
        onClick={() => {
          onClose();
          onPrepareDose();
        }}
      >
        Prepare new dose…
      </MenuItem>

      <MenuItem
        onClick={() => {
          onClose();
          onAdministerDose();
        }}
      >
        Administer new dose…
      </MenuItem>
    </Menu>
  );
}
