import type { DashboardCardProps, Severity, } from "../../features/doctor/types";

const severityStyles: Record<Severity, string> = {
  normal: "border-gray-200 hover:border-blue-500",
  warning: "border-yellow-500 bg-yellow-50 hover:border-yellow-600",
  danger: "border-red-500 bg-red-50 hover:border-red-600",
};

const badgeStyles: Record<Severity, string> = {
  normal: "bg-blue-200 text-blue-800",
  warning: "bg-yellow-200 text-yellow-900",
  danger: "bg-red-200 text-red-800",
};

const DashboardCard = ({
  title,
  value,
  severity = "normal",
  badge,
  onClick,
}: DashboardCardProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-full overflow-hidden rounded border text-left shadow-sm transition hover:shadow-md ${severityStyles[severity]}`}
    >
      <div className="flex h-full">
        {/* Left urgency bar */}
        <div
          className={`w-1 ${
            severity === "danger"
              ? "bg-red-500"
              : severity === "warning"
              ? "bg-yellow-500"
              : "bg-blue-500"
          }`}
        />

        {/* Card content */}
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-gray-500">
              {title}
            </h2>

            {badge && (
              <span
                className={`rounded px-2 py-0.5 text-xs font-medium ${badgeStyles[severity]}`}
              >
                {badge}
              </span>
            )}
          </div>

          <p className="mt-2 text-2xl font-semibold">
            {value}
          </p>
        </div>
      </div>
    </button>
  );
};

export default DashboardCard;