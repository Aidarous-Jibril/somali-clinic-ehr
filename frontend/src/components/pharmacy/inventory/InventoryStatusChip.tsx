import Chip from "@mui/material/Chip";

type Props = {
  status: string;
};

const InventoryStatusChip = ({ status }: Props) => {
  switch (status) {
    case "IN_STOCK":
      return (
        <Chip
          size="small"
          color="success"
          label={status}
        />
      );

    case "LOW_STOCK":
      return (
        <Chip
          size="small"
          color="warning"
          label={status}
        />
      );

    case "OUT_OF_STOCK":
      return (
        <Chip
          size="small"
          color="error"
          label={status}
        />
      );

    default:
      return (
        <Chip
          size="small"
          label={status}
        />
      );
  }
};

export default InventoryStatusChip;