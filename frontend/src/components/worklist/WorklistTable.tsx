//src/components/worklist/WorklistTable.tsx
import {
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";

import {
  DataGrid,
  type GridColDef,
} from "@mui/x-data-grid";

type Props<T> = {
  title: string;
  subtitle: string;

  rows: T[];
  columns: GridColDef[];

  selectedId: string;

  onSelect: (id: string) => void;
};

function WorklistTable<T extends { id: string }>({
  title,
  subtitle,
  rows,
  columns,
  selectedId,
  onSelect,
}: Props<T>) {
  return (
    <Card elevation={1}>

      <CardHeader
        title={
          <div className="text-sm font-semibold">
            {title}
          </div>
        }
        subheader={
          <div className="text-xs text-gray-500">
            {subtitle}
          </div>
        }
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
              backgroundColor: "#E3F2FD",
            },
          }}
        />

      </CardContent>

    </Card>
  );
}

export default WorklistTable;