import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { Download, FileText, Plus, BarChart2 } from "lucide-react";

export default function Reports() {
  const { fetchWithAuth } = useAuth();
  const [reports, setReports] = useState([]);
  const [deptId, setDeptId] = useState("");
  const [type, setType] = useState("Departmental Summary");

  const loadReports = async () => {
    const res = await fetchWithAuth("/reports/");
    if (res.ok) setReports(await res.json());
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    const res = await fetchWithAuth("/reports/generate", {
      method: "POST",
      body: JSON.stringify({ dept_id: parseInt(deptId), report_type: type }),
    });
    if (res.ok) loadReports();
  };

  const handleDownload = async (id) => {
    try {
      const response = await fetchWithAuth(`/reports/${id}/export`);
      if (!response.ok) throw new Error("Export block rejected request");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `MARS_Report_${id}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center space-x-1.5">
            <BarChart2 className="h-4 w-4 text-slate-500" />{" "}
            <span>Trigger Aggregation Engine</span>
          </h3>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Target Cluster Scope ID
              </label>
              <input
                type="number"
                required
                placeholder="Use 999 for Global Cluster"
                value={deptId}
                onChange={(e) => setDeptId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Reporting Framework Modality
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white"
              >
                <option value="Departmental Summary">
                  Departmental Summary
                </option>
                <option value="Weekly Analysis Check">
                  Weekly Analysis Check
                </option>
                <option value="Monthly System Audit">
                  Monthly System Audit
                </option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-[#5B6E5D] hover:bg-[#4C5B4E] text-white py-2 rounded-xl text-xs font-bold transition-colors"
            >
              Generate Report
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
            Historical Architecture Summaries
          </h3>
          <div className="space-y-3">
            {reports.length === 0 ? (
              <p className="text-sm text-gray-400 font-medium py-6 text-center">
                No structural summary snapshots calculated yet.
              </p>
            ) : (
              reports.map((report) => (
                <div
                  key={report.report_id}
                  className="flex items-center justify-between border border-gray-100 rounded-xl p-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-700">
                        {report.report_type}
                      </h4>
                      <p className="text-[11px] text-gray-400 font-medium">
                        Cluster Ref Pointer: {report.dept_id} • Average Matrix
                        Node Performance:{" "}
                        <span className="font-bold text-slate-600">
                          {report.average_attendance}%
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(report.report_id)}
                    className="p-2 border border-gray-200 hover:bg-white text-slate-600 rounded-xl hover:text-[#5B6E5D] transition-colors shadow-2xs"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
