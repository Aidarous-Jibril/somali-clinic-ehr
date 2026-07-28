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

import { mockRecentMovements } from "../../../features/pharmacy/constants";

const movementColor = (type: string) => {
  switch (type) {
    case "Received":
      return "success";

    case "Dispensed":
      return "primary";

    case "Adjusted":
      return "warning";

    default:
      return "default";
  }
};

const RecentMovementsCard = () => {
  return (
    <Card sx={{ height: 320 }}>
      <CardHeader
        title="Recent Stock Movements"
        action={
          <Link component="button" underline="hover">
            View History
          </Link>
        }
      />

      <CardContent sx={{ pt: 0 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Movement</TableCell>
                <TableCell align="right">
                  Qty
                </TableCell>
                <TableCell align="center">
                  Time
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {mockRecentMovements.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product}</TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={item.type}
                      color={movementColor(item.type)}
                    />
                  </TableCell>

                  <TableCell align="right">
                    {item.quantity}
                  </TableCell>

                  <TableCell align="center">
                    {item.time}
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

export default RecentMovementsCard;