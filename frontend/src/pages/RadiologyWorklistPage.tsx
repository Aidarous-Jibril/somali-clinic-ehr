// import { useEffect, useMemo, useState } from "react";

// import RadiologyWorklist from "../components/radiology/RadiologyWorklist";
// import RadiologyDetails from "../components/radiology/RadiologyDetails";
// import RadiologyActions from "../components/radiology/RadiologyActions";
// import RadiologyReportDialog from "../components/radiology/RadiologyReportDialog";

// import { useRadiologyWorklist } from "../hooks/radiology/useRadiologyWorklist";

// import { useStartRadiologyOrder } from "../hooks/radiology/useStartRadiologyOrder";
// import { useSubmitRadiologyReport } from "../hooks/radiology/useSubmitRadiologyReport";
// import { useReviewRadiologyOrder } from "../hooks/radiology/useReviewRadiologyOrder";
// import { useCompleteRadiologyOrder } from "../hooks/radiology/useCompleteRadiologyOrder";

// const RadiologyWorklistPage = () => {
//   const { data: rows = [], isLoading, refetch, } = useRadiologyWorklist();

//   const startMutation = useStartRadiologyOrder();
//   const reportMutation = useSubmitRadiologyReport();
//   const reviewMutation = useReviewRadiologyOrder();
//   const completeMutation = useCompleteRadiologyOrder();

//   const [selectedId, setSelectedId] = useState("");
//   const [reportOpen, setReportOpen] = useState(false);

//   // Automatically select first order
//   useEffect(() => {
//     if (rows.length === 0) {
//       setSelectedId("");
//       return;
//     }

//     const exists = rows.some((r: any) => r.id === selectedId);

//     if (!exists) {
//       setSelectedId(rows[0].id);
//     }
//   }, [rows, selectedId]);

//   const selected = useMemo(() => {
//     return rows.find((r: any) => r.id === selectedId) ?? null;
//   }, [rows, selectedId]);

//   if (isLoading) {
//     return (
//       <div className="p-6">
//         Loading radiology worklist...
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-3">

//       {/* Header */}

//       <div className="flex items-center justify-between">
//         <div className="text-[18px] font-semibold">
//           Radiology Worklist
//         </div>

//         <button
//           className="rounded border px-3 py-1 text-sm hover:bg-gray-100"
//           onClick={() => refetch()}
//         >
//           Refresh
//         </button>
//       </div>

//       {/* Main Grid */}

//       <div className="grid gap-3 grid-cols-1 xl:grid-cols-[1fr_1fr_260px]">

//         <RadiologyWorklist
//           rows={rows}
//           selectedId={selectedId}
//           onSelect={setSelectedId}
//         />

//         <RadiologyDetails
//           order={selected}
//         />

//         <RadiologyActions
//           order={selected}
//           onStart={async () => {
//             if (!selected) return;

//             await startMutation.mutateAsync(
//               selected.orderId
//             );

//             await refetch();
//           }}

//           onWriteReport={() => {
//             if (!selected) return;

//             setReportOpen(true);
//           }}

//           onReview={async () => {
//             if (!selected) return;

//             await reviewMutation.mutateAsync(
//               selected.orderId
//             );

//             await refetch();
//           }}

//           onComplete={async () => {
//             if (!selected) return;

//             await completeMutation.mutateAsync(
//               selected.orderId
//             );

//             await refetch();
//           }}
//         />

//       </div>

//       <RadiologyReportDialog
//         open={reportOpen}
//         order={selected}
//         onClose={() => setReportOpen(false)}
//         onSubmit={async (payload) => {
//           if (!selected) return;

//           await reportMutation.mutateAsync({
//             orderId: selected.orderId,
//             payload,
//           });

//           setReportOpen(false);

//           await refetch();
//         }}
//       />

//     </div>
//   );
// };

// export default RadiologyWorklistPage;


import { useEffect, useMemo, useState } from "react";
import { Button } from "@mui/material";

import WorklistLayout from "../components/worklist/WorklistLayout";

import RadiologyWorklist from "../components/radiology/RadiologyWorklist";
import RadiologyDetails from "../components/radiology/RadiologyDetails";
import RadiologyActions from "../components/radiology/RadiologyActions";
import RadiologyReportDialog from "../components/radiology/RadiologyReportDialog";

import { useRadiologyWorklist } from "../hooks/radiology/useRadiologyWorklist";
import { useStartRadiologyOrder } from "../hooks/radiology/useStartRadiologyOrder";
import { useSubmitRadiologyReport } from "../hooks/radiology/useSubmitRadiologyReport";
import { useReviewRadiologyOrder } from "../hooks/radiology/useReviewRadiologyOrder";
import { useCompleteRadiologyOrder } from "../hooks/radiology/useCompleteRadiologyOrder";

const RadiologyWorklistPage = () => {
  const {
    data: rows = [],
    isLoading,
    refetch,
  } = useRadiologyWorklist();

  const startMutation = useStartRadiologyOrder();
  const reportMutation = useSubmitRadiologyReport();
  const reviewMutation = useReviewRadiologyOrder();
  const completeMutation = useCompleteRadiologyOrder();

  const [selectedId, setSelectedId] = useState("");
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    if (!rows.length) {
      setSelectedId("");
      return;
    }

    if (!rows.some((r: any) => r.id === selectedId)) {
      setSelectedId(rows[0].id);
    }
  }, [rows, selectedId]);

  const selected = useMemo(
    () => rows.find((r: any) => r.id === selectedId) ?? null,
    [rows, selectedId]
  );

  if (isLoading) {
    return <div className="p-6">Loading radiology worklist...</div>;
  }

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          Radiology Worklist
        </h1>

        <Button
          variant="outlined"
          size="small"
          onClick={() => refetch()}
        >
          Refresh
        </Button>
      </div>

      <WorklistLayout
        worklist={
          <RadiologyWorklist
            rows={rows}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        }
        details={
          <RadiologyDetails
            order={selected}
          />
        }
        actions={
          <RadiologyActions
            order={selected}
            onStart={async () => {
              if (!selected) return;

              await startMutation.mutateAsync(
                selected.orderId
              );

              await refetch();
            }}
            onWriteReport={() =>
              setReportOpen(true)
            }
            onReview={async () => {
              if (!selected) return;

              await reviewMutation.mutateAsync(
                selected.orderId
              );

              await refetch();
            }}
            onComplete={async () => {
              if (!selected) return;

              await completeMutation.mutateAsync(
                selected.orderId
              );

              await refetch();
            }}
          />
        }
      />

      <RadiologyReportDialog
        open={reportOpen}
        order={selected}
        onClose={() => setReportOpen(false)}
        onSubmit={async (payload) => {
          if (!selected) return;

          await reportMutation.mutateAsync({
            orderId: selected.orderId,
            payload,
          });

          setReportOpen(false);

          await refetch();
        }}
      />
    </>
  );
};

export default RadiologyWorklistPage;