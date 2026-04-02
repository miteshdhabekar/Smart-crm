import { useState, useEffect } from "react"; // Added useEffect
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import { User, Mail, Lock, CheckCircle, ShieldCheck, Loader2 } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const [countdown, setCountdown] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const data = await registerUser(formData);
      setMessage(data.message || "Registration successful!");

      let seconds = 5;
      setCountdown(seconds);

      // Redirect logic
      const interval = setInterval(() => {
        seconds -= 1;
        setCountdown(seconds);

        if (seconds <= 0) {
          clearInterval(interval);
          navigate("/login");
        }
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
      setIsLoading(false); // Only stop loading if it failed
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-row-reverse">
      {/* SIDEBAR: Features & Trust Signals */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-50 relative overflow-hidden items-center justify-center border-l border-slate-100">
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/cube-grid.png")` }}
        ></div>
        
        <div className="relative z-10 p-16 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
            <ShieldCheck size={14} /> Enterprise Ready
          </div>
          
          <h1 className="text-4xl font-bold text-slate-900 leading-tight mb-8">
            Start scaling your <span className="text-indigo-600">customer success</span> today.
          </h1>
          
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="mt-1 h-10 w-10 flex-shrink-0 rounded-lg bg-white shadow-sm flex items-center justify-center text-indigo-600 border border-indigo-100">
                <CheckCircle size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">Free 14-day trial</h4>
                <p className="text-sm text-slate-500">Full access to all CRM modules. No credit card required.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 h-10 w-10 flex-shrink-0 rounded-lg bg-white shadow-sm flex items-center justify-center text-indigo-600 border border-indigo-100">
                <CheckCircle size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">Secure Cloud Storage</h4>
                <p className="text-sm text-slate-500">ISO 27001 certified data protection for your leads.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FORM SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-10 text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-slate-500 mt-2 text-sm uppercase font-medium tracking-wide">Join 5,000+ growing businesses</p>
          </div>

          {message && (
            <div className="mb-6 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 text-sm font-medium">
              {message} {countdown !== null && `Redirecting in ${countdown}s...`}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name} // CONNECTED
                  onChange={handleChange} // CONNECTED
                  placeholder="John Doe"
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg pl-12 pr-4 py-3.5 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Work Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email} // CONNECTED
                  onChange={handleChange} // CONNECTED
                  placeholder="name@company.com"
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg pl-12 pr-4 py-3.5 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Secure Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password} // CONNECTED
                  onChange={handleChange} // CONNECTED
                  placeholder="••••••••"
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg pl-12 pr-4 py-3.5 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-4 rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-70"
              >
                {isLoading && !message ? (
                  <Loader2 className="animate-spin mr-2" size={20} />
                ) : (
                  "Create My Account"
                )}
              </button>
            </div>
          </form>

          <p className="text-center text-slate-500 mt-8 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline underline-offset-4">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;