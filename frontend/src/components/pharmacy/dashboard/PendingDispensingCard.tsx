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

import { mockPendingDispensing } from "../../../features/pharmacy/constants";

const statusColor = (status: string) => {
  switch (status) {
    case "Ready":
      return "success";

    case "Pending":
      return "warning";

    case "In Progress":
      return "info";

    default:
      return "default";
  }
};

const PendingDispensingCard = () => {
  return (
    <Card sx={{ height: 320 }}>
      <CardHeader
        title="Pending Dispensing"
        action={
          <Link component="button" underline="hover">
            View Worklist
          </Link>
        }
      />

      <CardContent sx={{ pt: 0 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Medication</TableCell>
                <TableCell align="center">
                  Qty
                </TableCell>
                <TableCell align="center">
                  Status
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {mockPendingDispensing.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.patient}</TableCell>

                  <TableCell>{row.medication}</TableCell>

                  <TableCell align="center">
                    {row.quantity}
                  </TableCell>

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

export default PendingDispensingCard;