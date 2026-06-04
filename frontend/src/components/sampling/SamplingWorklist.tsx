import React from "react";

import {
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";

import { DataGrid,} from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";

import type { SamplingWorklistItem } from "../../features/sampling/types";

type Props = {
  rows: SamplingWorklistItem[];
  selectedId: string;
  onSelect: (id: string) => void;
};

const columns: GridColDef[] = [
  {
    field: "dateTime",
    headerName: "Date",
    flex: 1.2,
    valueFormatter: (value) =>
      new Date(value).toLocaleString(),
  },

  {
    field: "personId",
    headerName: "Person ID",
    flex: 1,
  },

  {
    field: "patientName",
    headerName: "Patient",
    flex: 1.4,
  },

  {
    field: "specialty",
    headerName: "Specialty",
    flex: 1,
  },

  {
    field: "rid",
    headerName: "RID",
    flex: 1,
  },
];

const SamplingWorklist: React.FC<Props> = ({
  rows,
  selectedId,
  onSelect,
}) => {
  return (
    <Card elevation={1}>
      <CardHeader
        title="Worklist"
        subheader="Pending sampling orders"
      />

      <CardContent sx={{ p: 0 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        hideFooter
        density="compact"
        disableRowSelectionOnClick
        onRowClick={(params) =>
          onSelect(params.row.id)
        }
        getRowClassName={(params) =>
          params.id === selectedId
            ? "selected-row"
            : ""
        }
        sx={{
          border: 0,

          "& .MuiDataGrid-row": {
            cursor: "pointer",
          },

          "& .selected-row": {
            backgroundColor: "#e3f2fd",
          },
        }}
      />
      </CardContent>
    </Card>
  );
};

export default SamplingWorklist;