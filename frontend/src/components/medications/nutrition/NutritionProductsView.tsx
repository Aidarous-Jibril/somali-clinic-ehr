import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

import {
  type NutritionStatusFilter,
} from "../../../features/medications/types";

import { useNutritionProducts } from "../../../hooks/medications/useNutritionProducts";
import { NutritionToolbar } from "./NutritionToolbar";
import { RegisterNutritionProductDialog } from "./RegisterNutritionProductDialog";

export function NutritionProductsView() {
  const { patientId } = useParams<{ patientId: string }>();

  const [from, setFrom] = useState( dayjs().subtract(1, "year").format("YYYY-MM-DD"));
  const [to, setTo] = useState( dayjs().format("YYYY-MM-DD") );
  const [status, setStatus] =  useState<NutritionStatusFilter>("valid");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data = [], isLoading, refetch } = useNutritionProducts(patientId);

  const rows = useMemo(() => {
    return data.filter((row) => {
      const date = dayjs(row.prescribedDate);

      if (date.isBefore(dayjs(from), "day")) return false;
      if (date.isAfter(dayjs(to), "day")) return false;

      if (status === "all") return true;

      return row.status === status;
    });
  }, [data, from, to, status]);

  return (
    <div className="flex h-full flex-col">
      <NutritionToolbar
        from={from}
        to={to}
        status={status}
        onFromChange={setFrom}
        onToChange={setTo}
        onStatusChange={setStatus}
        onUpdate={() => refetch()}
        onRegister={() => setDialogOpen(true)}
      />

      <div className="flex-1 overflow-auto rounded border border-gray-300 bg-white">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-gray-100 text-left">
            <tr className="text-gray-700">
              <th className="px-3 py-2 font-semibold">Prescribed</th>
              <th className="px-3 py-2 font-semibold">Product</th>
              <th className="px-3 py-2 font-semibold">Description</th>
              <th className="px-3 py-2 font-semibold">Article no</th>
              <th className="px-3 py-2 font-semibold">Product area</th>
              <th className="px-3 py-2 font-semibold">Valid until</th>
              <th className="px-3 py-2 font-semibold">Prescriber</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-sm text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-sm text-gray-500"
                >
                  No nutrition prescriptions in this period.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-gray-200"
                >
                  <td className="px-3 py-2">
                    {row.prescribedDate}
                  </td>
                  <td className="px-3 py-2 font-medium">
                    {row.product}
                  </td>
                  <td className="px-3 py-2">
                    {row.description}
                  </td>
                  <td className="px-3 py-2">
                    {row.articleNumber}
                  </td>
                  <td className="px-3 py-2">
                    {row.productArea}
                  </td>
                  <td className="px-3 py-2">
                    {row.validUntil}
                  </td>
                  <td className="px-3 py-2">
                    {row.prescriber}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {patientId && (
        <RegisterNutritionProductDialog
          open={dialogOpen}
          patientId={patientId}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </div>
  );
}