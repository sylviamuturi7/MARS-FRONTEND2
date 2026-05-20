import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { Layers, Plus, Database } from "lucide-react";

export default function Departments() {
  const { fetchWithAuth } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [payload, setPayload] = useState({
    dept_name: "",
    dept_code: "",
    description: "",
  });

  const loadDepts = async () => {
    const res = await fetchWithAuth("/departments/");
    if (res.ok) setDepartments(await res.json());
  };

  useEffect(() => {
    loadDepts();
  }, []);

  const handleDeploy = async (e) => {
    e.preventDefault();
    const res = await fetchWithAuth("/departments/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setShowAddForm(false);
      setPayload({ dept_name: "", dept_code: "", description: "" });
      loadDepts();
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Academic Departments
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure and manage the foundational pillars of the MARS ecosystem.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#3A5A40] hover:bg-[#2F4934] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add Department</span>
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleDeploy}
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-8 space-y-4 max-w-xl animate-fadeIn"
        >
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Initialize Cluster Segment Matrix
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Department Name
              </label>
              <input
                type="text"
                required
                value={payload.dept_name}
                onChange={(e) =>
                  setPayload({ ...payload, dept_name: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Code Tag
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SDT"
                value={payload.dept_code}
                onChange={(e) =>
                  setPayload({ ...payload, dept_code: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm uppercase"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Description Meta Statement
            </label>
            <textarea
              value={payload.description}
              onChange={(e) =>
                setPayload({ ...payload, description: e.target.value })
              }
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm h-20 resize-none"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-[#3A5A40] text-white rounded-lg text-xs font-bold"
            >
              Deploy Module
            </button>
          </div>
        </form>
      )}

      {/* Flex Matrix Array Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div
            key={dept.dept_id}
            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs relative flex flex-col justify-between hover:shadow-md transition-shadow group"
          >
            <div className="absolute top-5 right-5 px-2 py-0.5 border border-slate-200 rounded bg-slate-50 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              {dept.dept_code}
            </div>
            <div>
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl w-fit mb-4 group-hover:scale-105 transition-transform">
                <Layers className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-slate-800">
                {dept.dept_name}
              </h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 font-medium">
                {dept.description || "No description provided."}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
