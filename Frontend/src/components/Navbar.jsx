import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Radio,
  LayoutDashboard,
  Laptop,
  Network,
  FileBarChart,
  LogOut,
  User,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="p-2 bg-gray-50 rounded-full border border-gray-100">
          <Radio className="h-5 w-5 text-emerald-700" />
        </div>
        <div>
          <h1 className="text-sm font-black tracking-wider text-slate-800">
            M.A.R.S.
          </h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
            Mac Registration Portal
          </p>
        </div>
      </div>

      <nav className="flex items-center space-x-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors ${isActive ? "bg-[#6D7E6E] text-white font-medium" : "text-gray-600 hover:bg-gray-100"}`
          }
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/students"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors ${isActive ? "bg-[#6D7E6E] text-white font-medium" : "text-gray-600 hover:bg-gray-100"}`
          }
        >
          <Laptop className="h-4 w-4" />
          <span>Devices & Students</span>
        </NavLink>
        <NavLink
          to="/departments"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors ${isActive ? "bg-[#6D7E6E] text-white font-medium" : "text-gray-600 hover:bg-gray-100"}`
          }
        >
          <Network className="h-4 w-4" />
          <span>Network Clusters</span>
        </NavLink>
        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors ${isActive ? "bg-[#6D7E6E] text-white font-medium" : "text-gray-600 hover:bg-gray-100"}`
          }
        >
          <FileBarChart className="h-4 w-4" />
          <span>System Reports</span>
        </NavLink>
      </nav>

      <div className="flex items-center space-x-4">
        <div
          onClick={() => navigate("/profile")}
          className="flex items-center space-x-3 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 cursor-pointer hover:bg-slate-100 transition-all"
        >
          <div className="bg-slate-200 p-1.5 rounded-full text-slate-600">
            <User className="h-4 w-4" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-slate-800">
              {user?.first_name} {user?.last_name || "Admin"}
            </p>
            <p className="text-[10px] text-gray-400 font-extrabold uppercase">
              {user?.role || "Faculty"}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="p-2 text-gray-400 hover:text-rose-600 rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
