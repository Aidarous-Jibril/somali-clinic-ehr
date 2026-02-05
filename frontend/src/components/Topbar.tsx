// src/components/Topbar.tsx
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import ViewListIcon from "@mui/icons-material/ViewList";
import CancelIcon from '@mui/icons-material/Cancel';

const Topbar = () => {
  return (
    <div className="flex w-full items-center gap-4 text-sm">
      {/* Left: Menu button + text */}
      {/* <div className="flex items-center gap-2 min-w-[120px]">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded border border-blue-300 bg-blue-700 hover:bg-blue-800"
        >
          <span className="text-lg leading-none">{">"}</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded border border-blue-300 bg-blue-700 px-3 py-1 hover:bg-blue-800"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white">
            +
          </span>
          <span className="font-semibold">Menu</span>
        </button>
      </div> */}

      {/* Middle: search fields (ID, first, lastname) */}
      <div className="flex flex-1 items-center gap-2">
        {/* ID / personal number – yellow background like Cosmic */}
        <input
          type="text"
          placeholder="ID"
          className="h-9 flex-1 max-w-xs rounded border border-blue-200 bg-yellow-100 px-2 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-300"
        />

        {/* First name */}
        <input
          type="text"
          placeholder="First name"
          className="h-9 flex-1 max-w-xs rounded border border-blue-200 bg-white px-2 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        {/* Last name */}
        <input
          type="text"
          placeholder="Last name"
          className="h-9 flex-1 max-w-xs rounded border border-blue-200 bg-white px-2 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        {/* Search icon button */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded border border-blue-200 bg-blue-600 hover:bg-blue-500"
        >
          <SearchIcon fontSize="medium" />
        </button>
      </div>

      {/* Right: Clear, Lists, user icons */}
      <div className="flex items-center gap-2">
        {/* Clear */}
        <button
          type="button"
          className="flex h-9 items-center gap-1 rounded border border-white px-3 text-xs font-medium hover:bg-blue-600"
        >
          <ClearAllIcon fontSize="small" />
          <span>Clear</span>
        </button>

        {/* Lists */}
        <button
          type="button"
          className="flex h-9 items-center gap-1 rounded border border-white px-3 text-xs font-medium hover:bg-blue-600"
        >
          <ViewListIcon fontSize="small" />
          <span>Lists ▾</span>
        </button>

        {/* Single user */}
        <button
          type="button"
          className="ml-1 flex h-9 w-9 items-center justify-center rounded border border-white bg-blue-700 hover:bg-blue-600"
        >
          <PersonIcon fontSize="small" />
        </button>

        {/* Group of users */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded border border-white bg-blue-700 hover:bg-blue-600"
        >
          <GroupIcon fontSize="small" />
        </button>
      </div>
    </div>
  );
};

export default Topbar;







