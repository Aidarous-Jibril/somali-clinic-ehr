// src/layouts/MainLayout.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Topbar from "../components/Topbar";
import { MessengerDialog } from "../features/messenger/dialogs/MessengerDialog";
import { useMessengerState } from "../features/messenger/hooks/useMessengerState";
import Sidebar from "../components/ Sidebar";

const MainLayout = () => {
  const location = useLocation();

  const [keepWindow, setKeepWindow] = useState(true);
  const [openMessenger, setOpenMessenger] = useState(false);

  const messenger = useMessengerState();
  const unreadCount = useMemo(() => messenger.unreadInboxCount, [messenger.unreadInboxCount]);

  // This ref will be the dialog container (content area only)
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!keepWindow) setOpenMessenger(false);
  }, [location.pathname, keepWindow]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#13265C] text-white">
        <Sidebar
          unreadCount={unreadCount}
          onOpenMessenger={() => setOpenMessenger(true)}
          keepWindow={keepWindow}
          onToggleKeepWindow={() => setKeepWindow((v) => !v)}
        />
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col">
        <header className="h-18 px-3 flex items-center bg-blue-700 text-white">
          <Topbar />
        </header>

        <main ref={contentRef} className="relative flex-1 overflow-auto bg-white p-6">
          <Outlet />
          <MessengerDialog
            open={openMessenger}
            onClose={() => setOpenMessenger(false)}
            state={messenger}
            container={contentRef.current}
          />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
