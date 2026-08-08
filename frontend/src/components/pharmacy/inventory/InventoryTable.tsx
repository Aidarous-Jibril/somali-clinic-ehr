import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import InventoryStatusChip from "./InventoryStatusChip";
import InventoryRowActions from "./InventoryRowActions";

import type { InventoryItem } from "../../../features/pharmacy/types";

interface Props {
  items: InventoryItem[];
  selected: InventoryItem | null;
  onSelect: (item: InventoryItem) => void;
}

const InventoryTable = ({ items, selected, onSelect, }: Props) => {
  return (
    <Paper elevation={1}>
      <TableContainer>
        <Table stickyHeader size="small">

          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Strength</TableCell>
              <TableCell>Batch</TableCell>
              <TableCell>Expiry</TableCell>
              <TableCell align="right"> Available</TableCell>
              <TableCell align="right"> Reserved</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center"> Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((item) => (
              <TableRow
                hover
                key={item.id}
                selected={selected?.id === item.id}
                onClick={() => onSelect(item)}
                sx={{
                    cursor: "pointer",
                }}
>
                <TableCell>{item.product}</TableCell>

                <TableCell>{item.strength}</TableCell>

                <TableCell>{item.batch}</TableCell>

                <TableCell>{item.expiry}</TableCell>

                <TableCell align="right">
                  {item.available}
                </TableCell>

                <TableCell align="right">
                  {item.reserved}
                </TableCell>

                <TableCell>{item.supplier}</TableCell>

                <TableCell>
                  <InventoryStatusChip
                    status={item.status}
                  />
                </TableCell>

                <TableCell align="center">
                  <InventoryRowActions />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>
    </Paper>
  );
};

export default InventoryTable;