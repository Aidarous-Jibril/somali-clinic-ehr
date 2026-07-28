//src/components/worklist/WorklistStatusBadge.tsx
import React from "react";

type Props = {
  status?: string;
};

const colors: Record<string, string> = {
  ordered: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  processing: "bg-blue-100 text-blue-800",

  registered: "bg-gray-100 text-gray-800",
  collected: "bg-indigo-100 text-indigo-800",
  received: "bg-cyan-100 text-cyan-800",
  completed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",

  awaiting_result: "bg-blue-100 text-blue-800",
  resulted: "bg-green-100 text-green-800",
  reviewed: "bg-purple-100 text-purple-800",

  cancelled: "bg-red-100 text-red-800",
};

const WorklistStatusBadge: React.FC<Props> = ({
  status,
}) => {
  if (!status) {
    return (
      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500">
        -
      </span>
    );
  }

  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
        colors[status] ??
        "bg-gray-100 text-gray-700"
      }`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
};

export default WorklistStatusBadge;