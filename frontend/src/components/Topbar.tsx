import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import ViewListIcon from "@mui/icons-material/ViewList";

import { usePatientSearch } from "../hooks/patient/usePatientSearch";

const Topbar = () => {
  const navigate = useNavigate();

  const [mrn, setMrn] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const query = [mrn, firstName, lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  const { data: results = [] } = usePatientSearch(query);

  const handleSearch = () => {
    if (!query) return;

    if (results.length === 1) {
      navigate(`/patients/${results[0].id}`);
      return;
    }

    navigate(`/patients?q=${encodeURIComponent(query)}`);
  };

  const handleClear = () => {
    setMrn("");
    setFirstName("");
    setLastName("");
    navigate("/patients");
  };

  return (
    <div className="flex w-full items-center gap-4 text-sm">
      {/* Search area */}
      <div className="flex flex-1 items-center gap-2">
        <input
          value={mrn}
          onChange={(e) => setMrn(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="MRN / Phone"
          className="h-9 flex-1 max-w-xs rounded border border-blue-200 bg-yellow-100 px-2 text-gray-900"
        />

        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="First name"
          className="h-9 flex-1 max-w-xs rounded border border-blue-200 bg-white px-2 text-gray-900"
        />

        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Last name"
          className="h-9 flex-1 max-w-xs rounded border border-blue-200 bg-white px-2 text-gray-900"
        />

        <button
          onClick={handleSearch}
          className="flex h-9 w-9 items-center justify-center rounded border border-blue-200 bg-blue-600 hover:bg-blue-500"
        >
          <SearchIcon fontSize="medium" />
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleClear}
          className="flex h-9 items-center gap-1 rounded border border-white px-3 text-xs font-medium hover:bg-blue-600"
        >
          <ClearAllIcon fontSize="small" />
          <span>Clear</span>
        </button>

        <button className="flex h-9 items-center gap-1 rounded border border-white px-3 text-xs font-medium hover:bg-blue-600">
          <ViewListIcon fontSize="small" />
          <span>Lists ▾</span>
        </button>

        <button className="flex h-9 w-9 items-center justify-center rounded border border-white bg-blue-700 hover:bg-blue-600">
          <PersonIcon fontSize="small" />
        </button>

        <button className="flex h-9 w-9 items-center justify-center rounded border border-white bg-blue-700 hover:bg-blue-600">
          <GroupIcon fontSize="small" />
        </button>
      </div>
    </div>
  );
};

export default Topbar;