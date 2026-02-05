// src/components/medications/nutrition/NutritionDetailsDialog.tsx
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import type { NutritionPrescription } from "../../../features/medications/types";

type RowProps = {
  label: string;
  value?: React.ReactNode;
};

function Row({ label, value }: RowProps) {
  return (
    <div className="grid grid-cols-[180px_1fr] gap-3 py-1 text-[12px]">
      <div className="text-gray-600">{label}</div>
      <div className="text-gray-900">{value ?? "—"}</div>
    </div>
  );
}

export function NutritionDetailsDialog({
  open,
  onClose,
  item,
}: {
  open: boolean;
  onClose: () => void;
  item: NutritionPrescription | null;
}) {
  if (!item) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Prescription information</DialogTitle>

      <DialogContent dividers>
        <div className="space-y-1">
          <Row label="Product name" value={item.productName} />
          <Row label="Description" value={item.description} />
          <Row label="Article number" value={item.articleNo} />
          <Row label="Product area" value={item.productArea} />
          <Row label="Issued date" value={item.issuedDate} />
          <Row label="Prescribed on" value={item.prescribedOn} />
          <Row label="Prescriber" value={item.prescriber} />
          <Row label="Unit" value={item.unit} />
          <Row label="Packages" value={item.packages} />
          <Row label="Withdrawals" value={item.withdrawals} />
          <Row label="First withdrawal before" value={item.firstWithdrawalBefore} />
          <Row label="Benefit" value={item.benefit} />
          <Row label="Other instruction" value={item.otherInstruction} />
          <Row label="Dosing instruction" value={item.dosingInstruction} />

          <div className="my-3 border-t border-gray-200" />

          <Row label="UUID" value={item.uuid} />
          <Row label="Status" value={item.sendStatus} />
          <Row label="Sent" value={item.sentAt} />
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
