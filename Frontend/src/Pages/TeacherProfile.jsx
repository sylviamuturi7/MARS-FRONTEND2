import React, { useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

export default function TeacherProfile() {
  const { user, fetchWithAuth, setUser } = useAuth();
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    password: "",
  });
  const [msg, setMsg] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    const cleanData = { ...formData };
    if (!cleanData.password) delete cleanData.password;

    const res = await fetchWithAuth("/auth/me", {
      method: "PATCH",
      body: JSON.stringify(cleanData),
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setMsg(
        "Matrix administrative configuration credentials shifted successfully.",
      );
    }
  };

  return (
    <Layout>
      <div className="max-w-xl bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mx-auto">
        <h2 className="text-lg font-bold text-slate-800 mb-1">
          Administrative Profile Settings
        </h2>
        <p className="text-xs text-slate-400 mb-6 font-medium">
          Update structural parameters linking your teacher identity node.
        </p>
        {msg && (
          <div className="bg-emerald-50 text-emerald-700 text-xs p-3 rounded-xl mb-4 font-bold border border-emerald-100">
            {msg}
          </div>
        )}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Email Account Route
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Shift Access Password
            </label>
            <input
              type="password"
              placeholder="Leave empty to remain unchanged"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#5B6E5D] hover:bg-[#4C5B4E] text-white py-2.5 rounded-xl text-xs font-bold transition-colors"
          >
            Configure Changes 
          </button>
        </form>
      </div>
    </Layout>
  );
}
