//src/components/worklist/WorklistLayout.tsx
import React from "react";

type Props = {
  worklist: React.ReactNode;
  details: React.ReactNode;
  actions: React.ReactNode;
};

const WorklistLayout: React.FC<Props> = ({
  worklist,
  details,
  actions,
}) => {
  return (
    <div className="grid gap-3 grid-cols-1 xl:grid-cols-[40%_40%_20%]">
      {worklist}

      {details}

      {actions}
    </div>
  );
};

export default WorklistLayout;