import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { Activity, Radio, UserCheck, UserX } from "lucide-react";

export default function Dashboard() {
  const { fetchWithAuth } = useAuth();
  const [stats, setStats] = useState({
    total_registered: 0,
    present_today: 0,
    absent_today: 0,
  });
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const statsRes = await fetchWithAuth("/attendance/stats");
        if (statsRes.ok) setStats(await statsRes.json());

        const liveRes = await fetchWithAuth("/attendance/live");
        if (liveRes.ok) setLogs(await liveRes.json());
      } catch (err) {
        console.error("Failed to load dashboard metrics:", err);
      }
    };

    loadDashboardData();
    const ticker = setInterval(loadDashboardData, 5000); // Polling mechanism for live updates
    return () => clearInterval(ticker);
  }, []);

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Welcome back to the MARS administrative portal.
        </p>
      </div>

      {/* Numerical Analysis Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-slate-500">
              Total Registered
            </span>
            <Activity className="h-4 w-4 text-slate-400" />
          </div>
          <span className="text-3xl font-bold text-slate-800 mt-4">
            {stats.total_registered}
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-slate-500">
              Present Today
            </span>
            <Radio className="h-4 w-4 text-emerald-500" />
          </div>
          <span className="text-3xl font-bold text-emerald-600 mt-4">
            {stats.present_today}
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-slate-500">
              Absent Today
            </span>
            <UserX className="h-4 w-4 text-rose-500" />
          </div>
          <span className="text-3xl font-bold text-rose-600 mt-4">
            {stats.absent_today}
          </span>
        </div>
      </div>

      {/* Dynamic Data Stream Block */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-800 mb-4">
          Live Attendance Activity
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Student
                </th>
                <th className="pb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Mac Address
                </th>
                <th className="pb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Time
                </th>
                <th className="pb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="py-8 text-center text-sm text-gray-400 font-medium"
                  >
                    No live scanner activity detected today.
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <tr
                    key={index}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3.5 text-sm font-medium text-slate-700">
                      {log.student}
                    </td>
                    <td className="py-3.5 text-sm font-mono text-slate-500">
                      {log.mac}
                    </td>
                    <td className="py-3.5 text-sm text-slate-500">
                      {log.time}
                    </td>
                    <td className="py-3.5 text-sm">
                      <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold text-xs">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>{log.status}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
