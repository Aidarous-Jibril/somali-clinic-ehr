// src/components/dashboard/DashboardLinks.tsx
import React from "react";

type Props = {
  links: string[];
};

export const DashboardLinks: React.FC<Props> = ({ links }) => {
  return (
    <div className="px-3 py-3 text-sm">
      <p className="mb-2 text-gray-600">Shortcuts to external systems or frequently used resources.</p>
      <ul className="space-y-1 text-xs text-blue-700">
        {links.map((l) => (
          <li key={l}>• {l}</li>
        ))}
      </ul>
    </div>
  );
};
