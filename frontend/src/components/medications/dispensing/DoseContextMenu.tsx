// src/components/medications/dispensing/DoseContextMenu.tsx
import { Divider, Menu, MenuItem } from "@mui/material";

export type DoseContextMenuAction =
  | "prepare"
  | "administer"
  | "skip"
  | "selfAdmin"
  | "note"
  | "handover"
  | "viewLog"
  | "infusionPrepare"
  | "infusionStart"
  | "infusionEnd";

type Props = {
  open: boolean;
  x: number;
  y: number;
  onClose: () => void;

  /** show/hide infusion items */
  showInfusionActions?: boolean;
  infusionCanStart?: boolean;
  infusionCanEnd?: boolean;

  onAction: (action: DoseContextMenuAction) => void;
};

export function DoseContextMenu({
  open,
  x,
  y,
  onClose,
  onAction,
  showInfusionActions,
  infusionCanStart,
  infusionCanEnd,
}: Props) {
  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={open ? { top: y, left: x } : undefined}
    >
      {showInfusionActions ? (
        <>
          <MenuItem
            onClick={() => {
              onClose();
              onAction("infusionPrepare");
            }}
          >
            Prepare infusion…
          </MenuItem>

          <MenuItem
            disabled={!infusionCanStart}
            onClick={() => {
              onClose();
              onAction("infusionStart");
            }}
          >
            Start infusion…
          </MenuItem>

          <MenuItem
            disabled={!infusionCanEnd}
            onClick={() => {
              onClose();
              onAction("infusionEnd");
            }}
          >
            End infusion…
          </MenuItem>

          <Divider />
        </>
      ) : null}

      <MenuItem
        onClick={() => {
          onClose();
          onAction("prepare");
        }}
      >
        Prepare
      </MenuItem>

      <MenuItem
        onClick={() => {
          onClose();
          onAction("administer");
        }}
      >
        Administer
      </MenuItem>

      <MenuItem
        onClick={() => {
          onClose();
          onAction("skip");
        }}
      >
        Skip
      </MenuItem>

      <MenuItem
        onClick={() => {
          onClose();
          onAction("selfAdmin");
        }}
      >
        Self-administration
      </MenuItem>

      <MenuItem
        onClick={() => {
          onClose();
          onAction("note");
        }}
      >
        Note
      </MenuItem>

      <MenuItem
        onClick={() => {
          onClose();
          onAction("handover");
        }}
      >
        Handover…
      </MenuItem>

      <MenuItem
        onClick={() => {
          onClose();
          onAction("viewLog");
        }}
      >
        View log
      </MenuItem>
    </Menu>
  );
}
