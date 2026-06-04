import React, { useMemo, useState } from "react";
import { api } from "../api/client";

import ResultModal from "../components/lab/ResultModal";
import { useLabOrders } from "../hooks/orders/useLabOrders";

type LabFlag = "normal" | "high" | "low" | "critical";

const LabDashboard: React.FC = () => {
  const { data, isLoading, refetch } = useLabOrders();

  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  const [resultModalOpen, setResultModalOpen] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const orders = useMemo(() => {
    return data || [];
  }, [data]);

  /* ============== SAMPLE LIFECYCLE ================ */
  const handleCollect = async (sampleId: string) => {
    try {
      setLoadingActionId(sampleId);

      await api.post(`/samples/${sampleId}/collect`, {
        notes: "Collected in lab",
      });

      await refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleReceive = async (sampleId: string) => {
    try {
      setLoadingActionId(sampleId);

      await api.post(`/samples/${sampleId}/receive`);

      await refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleProcess = async (sampleId: string) => {
    try {
      setLoadingActionId(sampleId);

      await api.post(`/samples/${sampleId}/process`);

      await refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleComplete = async (order: any, sampleId: string) => {
    try {
      setLoadingActionId(sampleId);

      await api.post(`/samples/${sampleId}/complete`);

      // IMPORTANT
      // Keep selected order before refetch
      setSelectedOrder(order);

      // OPEN RESULT MODAL
      setResultModalOpen(true);

      await refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingActionId(null);
    }
  };

  /* ============== RESULT SUBMISSION ================ */
  const handleSubmitResult = async (data: {
    value: string;
    unit?: string;
    flag: LabFlag;
    comment?: string;
  }) => {
    if (!selectedOrder) return;

    try {
      await api.post( `/orders/${selectedOrder.id}/result`, data );

      setResultModalOpen(false);

      setSelectedOrder(null);

      await refetch();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };


  if (isLoading) {
    return (
      <div className="p-6">
        Loading lab worklist...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">
          Laboratory Dashboard
        </h1>

        <p className="text-sm text-gray-500">
          Active laboratory worklist
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order: any) => {
          const sample = order.samples?.[0];

          return (
            <div
              key={order.id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="font-semibold">
                    {order.name}
                  </div>

                  <div className="text-sm text-gray-600">
                    {order.patient?.firstName}{" "}
                    {order.patient?.lastName}
                  </div>

                  <div className="text-sm">
                    Order Status:{" "}
                    <span className="font-medium">
                      {order.status}
                    </span>
                  </div>

                  {sample && (
                    <div className="text-sm">
                      Sample Status:{" "}
                      <span className="font-medium">
                        {sample.status}
                      </span>
                    </div>
                  )}
                </div>

                {sample && (
                  <div className="flex gap-2">
                    {sample.status === "registered" && (
                      <button
                        onClick={() =>
                          handleCollect(sample.id)
                        }
                        disabled={
                          loadingActionId === sample.id
                        }
                        className="px-3 py-1 rounded bg-blue-600 text-white"
                      >
                        Collect
                      </button>
                    )}

                    {sample.status === "collected" && (
                      <button
                        onClick={() =>
                          handleReceive(sample.id)
                        }
                        disabled={
                          loadingActionId === sample.id
                        }
                        className="px-3 py-1 rounded bg-indigo-600 text-white"
                      >
                        Receive
                      </button>
                    )}

                    {sample.status === "received" && (
                      <button
                        onClick={() =>
                          handleProcess(sample.id)
                        }
                        disabled={
                          loadingActionId === sample.id
                        }
                        className="px-3 py-1 rounded bg-orange-600 text-white"
                      >
                        Process
                      </button>
                    )}

                    {sample.status === "processing" && (
                      <button
                        onClick={() =>
                          handleComplete(
                            order,
                            sample.id
                          )
                        }
                        disabled={
                          loadingActionId === sample.id
                        }
                        className="px-3 py-1 rounded bg-green-600 text-white"
                      >
                        Complete
                      </button>
                    )}

                    {order.status === "awaiting_result" && (
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setResultModalOpen(true);
                        }}
                        className="px-3 py-1 rounded bg-purple-600 text-white"
                      >
                        Enter Result
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* RESULT MODAL */}

      <ResultModal
        open={resultModalOpen}
        onClose={() => {
          setResultModalOpen(false);
          setSelectedOrder(null);
        }}
        onSubmit={handleSubmitResult}
      />
    </div>
  );
};

export default LabDashboard;