import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Imported for dynamic routing navigation
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { Plus, Search, Laptop, Trash2, X } from "lucide-react";

export default function Students() {
  const { fetchWithAuth } = useAuth();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Displays backend validation errors

  // Registration Payload State Container
  const [payload, setPayload] = useState({
    student_code: "",
    first_name: "",
    last_name: "",
    email: "",
    dept_id: "",
    mac_address: "",
    device_name: "",
  });

  const loadStudents = async () => {
    try {
      const res = await fetchWithAuth(
        `/students${search ? `?search=${search}` : ""}`,
      );
      if (res.ok) setStudents(await res.json());
    } catch (err) {
      console.error("Error loading registry catalog:", err);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [search]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear old errors

    try {
      // Send both key variations to ensure the backend captures the database ID safely
      const outboundingBody = {
        student_code: payload.student_code,
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
        mac_address: payload.mac_address,
        device_name: payload.device_name,
        dept_id: parseInt(payload.dept_id, 10),
        department_id: parseInt(payload.dept_id, 10),
      };

      const res = await fetchWithAuth("/students", {
        method: "POST",
        body: JSON.stringify(outboundingBody),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setPayload({
          student_code: "",
          first_name: "",
          last_name: "",
          email: "",
          dept_id: "",
          mac_address: "",
          device_name: "",
        });
        loadStudents();
      } else {
        const errData = await res.json().catch(() => ({}));
        setErrorMessage(
          errData.message || `Server returned error status: ${res.status}`,
        );
      }
    } catch (err) {
      setErrorMessage(
        "Network interface failure. Verify backend is operational.",
      );
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Revoke hardware registry entries for this identity node?")) {
      const res = await fetchWithAuth(`/students/${id}`, { method: "DELETE" });
      if (res.ok) loadStudents();
    }
  };

  return (
    <Layout>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Device Ownership Registry
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Bundle network identities and provision subnets.
          </p>
        </div>
        <button
          onClick={() => {
            setErrorMessage("");
            setIsModalOpen(true);
          }}
          className="bg-[#5B6E5D] hover:bg-[#4C5B4E] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add Student Device</span>
        </button>
      </div>

      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search matching owner tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/10 focus:border-[#6D7E6E]"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-gray-100">
              <th className="py-3 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Owner Identity
              </th>
              <th className="py-3 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                System ID
              </th>
              <th className="py-3 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Email
              </th>
              <th className="py-3 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="py-12 text-center text-sm text-gray-400 font-medium"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student.student_id || student.id}
                  className="hover:bg-slate-50/50"
                >
                  {/* LINKED NAME FIELD */}
                  <td className="py-4 px-6 text-sm font-semibold">
                    <Link
                      to={`/students/${student.student_id || student.id}`}
                      className="text-slate-700 hover:text-[#5B6E5D] transition-colors duration-150 ease-in-out cursor-pointer"
                    >
                      {student.first_name} {student.last_name}
                    </Link>
                  </td>
                  <td className="py-4 px-6 text-sm font-mono text-slate-500">
                    {student.student_code}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-500">
                    {student.email}
                  </td>
                  <td className="py-4 px-6 text-sm">
                    <button
                      onClick={() =>
                        handleDelete(student.student_id || student.id)
                      }
                      className="text-gray-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Node Provisioning Modal Layer */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-4">
              <h3 className="text-base font-bold text-slate-800">
                Provision New Registration Identity
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Dynamic Error Readout Alert */}
              {errorMessage && (
                <div className="p-3 text-xs bg-rose-50 text-rose-600 font-medium border border-rose-100 rounded-xl">
                  ⚠️ Error: {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={payload.first_name}
                    onChange={(e) =>
                      setPayload({ ...payload, first_name: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/10 focus:border-[#6D7E6E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={payload.last_name}
                    onChange={(e) =>
                      setPayload({ ...payload, last_name: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/10 focus:border-[#6D7E6E]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Code
                  </label>
                  <input
                    type="text"
                    required
                    value={payload.student_code}
                    onChange={(e) =>
                      setPayload({ ...payload, student_code: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/10 focus:border-[#6D7E6E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Department ID Pointer
                  </label>
                  <input
                    type="number"
                    required
                    value={payload.dept_id}
                    onChange={(e) =>
                      setPayload({ ...payload, dept_id: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/10 focus:border-[#6D7E6E]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={payload.email}
                  onChange={(e) =>
                    setPayload({ ...payload, email: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/10 focus:border-[#6D7E6E]"
                />
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center space-x-1">
                  <Laptop className="h-3.5 w-3.5" />{" "}
                  <span>Hardware Token Attachment</span>
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      MAC Address
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="00:1a:2b:3c:4d:5e"
                      value={payload.mac_address}
                      onChange={(e) =>
                        setPayload({ ...payload, mac_address: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700/10 focus:border-[#6D7E6E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Device Name Tag
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. iPad Pro"
                      value={payload.device_name}
                      onChange={(e) =>
                        setPayload({ ...payload, device_name: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/10 focus:border-[#6D7E6E]"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#5B6E5D] hover:bg-[#4C5B4E] text-white rounded-xl text-xs font-bold"
                >
                  Write Record to Chain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
