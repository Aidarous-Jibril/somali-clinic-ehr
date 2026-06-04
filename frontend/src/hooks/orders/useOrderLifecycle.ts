//src/hooks/useOrderLifecycle.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../../api/order.lifecycle.api";

export const useOrderLifecycle = (encounterId?: string, patientId?: string) => {
  const qc = useQueryClient();

  const invalidate = () => {
    if (!encounterId) return;
    qc.invalidateQueries({ queryKey: ["orders", encounterId] });
  };
  
    if (patientId) {
        qc.invalidateQueries({ queryKey: ["labResults", patientId] }); // 🔥 ADD THIS
      }
  return {
    start: useMutation({ mutationFn: api.startOrder, onSuccess: invalidate }),
        result: useMutation({
          mutationFn: ({ id, payload }: {
            id: string;
            payload: {
              value: string;
              unit?: string;
              flag: "normal" | "high" | "low" | "critical";
            };
          }) => api.resultOrder(id, payload),
          onSuccess: invalidate,
    }),
    // result: useMutation({ mutationFn: api.resultOrder, onSuccess: invalidate }),
    review: useMutation({ mutationFn: api.reviewOrder, onSuccess: invalidate }),
    complete: useMutation({ mutationFn: api.completeOrder, onSuccess: invalidate }),
  };
};