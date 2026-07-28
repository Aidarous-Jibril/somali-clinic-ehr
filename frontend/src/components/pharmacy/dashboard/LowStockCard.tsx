import {
  Card,
  CardHeader,
  CardContent,
  Chip,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { mockLowStock } from "../../../features/pharmacy/constants";

const LowStockCard = () => {
  return (
    <Card sx={{ height: 320 }}>
      <CardHeader
        title="Low Stock"
        action={
          <Link
            component="button"
            underline="hover"
          >
            View Inventory
          </Link>
        }
      />

      <CardContent sx={{ pt: 0 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Stock</TableCell>
                <TableCell align="right">Minimum</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {mockLowStock.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product}</TableCell>

                  <TableCell align="right">
                    {item.stock}
                  </TableCell>

                  <TableCell align="right">
                    {item.minimum}
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      size="small"
                      label={item.status}
                      color={
                        item.status === "Critical"
                          ? "error"
                          : "warning"
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default LowStockCard;