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

import { mockExpiringInventory } from "../../../features/pharmacy/constants";

const ExpiringInventoryCard = () => {
  return (
    <Card sx={{ height: 320 }}>
      <CardHeader
        title="Expiring Inventory"
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
                <TableCell>Batch</TableCell>
                <TableCell>Expires</TableCell>
                <TableCell align="center">
                  Status
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {mockExpiringInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product}</TableCell>

                  <TableCell>{item.batch}</TableCell>

                  <TableCell>
                    {item.expiry}
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      size="small"
                      label={`${item.daysRemaining} days`}
                      color={
                        item.status === "Urgent"
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

export default ExpiringInventoryCard;