import { NavLink } from "react-router-dom";
import React from "react";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import LogoutIcon from "@mui/icons-material/Logout";
import LockIcon from "@mui/icons-material/Lock";
import Tooltip from "@mui/material/Tooltip";

const navLinkClass = "block rounded px-3 py-2 text-sm hover:bg-blue-800 transition-colors";
const activeClass = "bg-blue-900";

type Props = {
  unreadCount?: number;
  onOpenMessenger?: () => void;

  keepWindow?: boolean;
  onToggleKeepWindow?: () => void;
};

const Sidebar: React.FC<Props> = ({
  unreadCount = 0,
  onOpenMessenger,
  keepWindow = true,
  onToggleKeepWindow,
}) => {
  return (
    <nav className="h-full flex flex-col px-4 py-3">
      <div className="mb-6 text-lg font-semibold">Somali Clinic EHR</div>

      <ul className="space-y-1">
        <li>
          <NavLink to="/" end className={({ isActive }) => `${navLinkClass} ${isActive ? activeClass : ""}`}>
            My Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/patients" className={({ isActive }) => `${navLinkClass} ${isActive ? activeClass : ""}`}>
            Patients
          </NavLink>
        </li>

        <li>
          <NavLink to="/appointments" className={({ isActive }) => `${navLinkClass} ${isActive ? activeClass : ""}`}>
            Appoinments
          </NavLink>
        </li>

        <li>
          <NavLink to="/unit-overview" className={({ isActive }) => `${navLinkClass} ${isActive ? activeClass : ""}`}>
            Unit overview
          </NavLink>
        </li>

        <li>
          <NavLink to="/sampling-data" className={({ isActive }) => `${navLinkClass} ${isActive ? activeClass : ""}`}>
            Sampling data
          </NavLink>
        </li>

        <li>
          <NavLink to="/consent-management" className={({ isActive }) => `${navLinkClass} ${isActive ? activeClass : ""}`}>
            Consent management
          </NavLink>
        </li>
      </ul>

      {/* Bottom "Cosmic-like" icons area */}
      <div className="mt-auto pt-4">
        <label className="flex items-center gap-2 text-xs text-blue-100 select-none">
          <input type="checkbox" checked={keepWindow} onChange={onToggleKeepWindow} />
          Keep window
        </label>

        <div className="mt-3 flex items-center gap-3">
          <Tooltip title="Messenger">
            <button
              type="button"
              onClick={() => onOpenMessenger?.()}
              className="relative rounded p-2 hover:bg-blue-800"
            >
              <MailOutlineIcon fontSize="medium" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 min-w-[18px] rounded bg-red-600 px-1 text-[10px] font-bold leading-[18px] text-white text-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          </Tooltip>

          <Tooltip title="Lock">
            <button type="button" className="rounded p-2 hover:bg-blue-800">
              <LockIcon fontSize="medium" />
            </button>
          </Tooltip>

          <Tooltip title="Logout">
            <button type="button" className="rounded p-2 hover:bg-blue-800">
              <LogoutIcon fontSize="medium" />
            </button>
          </Tooltip>

          <Tooltip title="Power">
            <button type="button" className="rounded p-2 hover:bg-blue-800">
              <PowerSettingsNewIcon fontSize="medium" />
            </button>
          </Tooltip>
        </div>

        <div className="mt-4 text-xs text-blue-100">© {new Date().getFullYear()} Somali Clinic</div>
      </div>
    </nav>
  );
};

export default Sidebar;
