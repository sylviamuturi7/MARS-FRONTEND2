import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, Hexagon } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("https://mars-api-o24g.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid credentials");
      login(data.access_token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFEFEF] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-10 text-center border border-gray-100">
        <div className="inline-flex items-center justify-center p-3 bg-gray-50 rounded-full mb-4 border border-gray-100">
          <Hexagon className="h-8 w-8 text-gray-400 fill-gray-50" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
          MARS
        </h2>
        <p className="text-[10px] tracking-widest text-slate-400 uppercase font-bold mt-1 mb-8">
          Mac-Address Attendance & Registration System
        </p>

        <div className="text-left mb-6">
          <h3 className="text-lg font-bold text-slate-800">
            Administrator Login
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Please enter your credentials below.
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs p-3 rounded-xl mb-4 text-left font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@institution.edu"
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-[#6D7E6E] bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Password
              </label>
              <a
                href="#"
                className="text-xs text-slate-500 font-medium hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-[#6D7E6E] bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#5B6E5D] hover:bg-[#4C5B4E] text-white font-medium py-3 px-4 rounded-xl text-sm shadow-sm transition-colors mt-2"
          >
            Login to MARS →
          </button>
        </form>

        <div className="mt-4">
          <Link
            to="/register"
            className="block w-full border border-[#5B6E5D] text-[#5B6E5D] hover:bg-slate-50 font-medium py-3 px-4 rounded-xl text-sm transition-colors text-center"
          >
            Create Account +
          </Link>
        </div>

        <p className="text-xs text-slate-400 mt-8">
          Need technical assistance?{" "}
          <a href="#" className="text-slate-700 font-bold hover:underline">
            Contact System Admin
          </a>
        </p>
      </div>
    </div>
  );
}
