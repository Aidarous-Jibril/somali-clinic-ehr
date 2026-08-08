import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { mockPendingPurchases } from "../../../features/pharmacy/constants";

const statusColor = (status: string) => {
  switch (status) {
    case "Ordered":
      return "primary";

    case "Partially Received":
      return "warning";

    case "Delayed":
      return "error";

    default:
      return "default";
  }
};

const PendingPurchasesCard = () => {
  return (
    <Card sx={{ height: 320 }}>
      <CardHeader
        title="Pending Purchases"
        action={
          <Link component="button" underline="hover">
            View Purchases
          </Link>
        }
      />

      <CardContent sx={{ pt: 0 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Supplier</TableCell>
                <TableCell>PO</TableCell>
                <TableCell>Expected</TableCell>
                <TableCell align="center">
                  Status
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {mockPendingPurchases.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.supplier}</TableCell>

                  <TableCell>{row.poNumber}</TableCell>

                  <TableCell>{row.expected}</TableCell>

                  <TableCell align="center">
                    <Chip
                      size="small"
                      label={row.status}
                      color={statusColor(row.status)}
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

export default PendingPurchasesCard;