import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaClipboardCheck,
  FaHistory,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const AdminSidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
    { name: "Users", path: "/admin/users", icon: <FaUsers /> },
    { name: "Requests", path: "/admin/requests", icon: <FaClipboardCheck /> },
    { name: "Activity", path: "/admin/activity", icon: <FaHistory /> },
  ];

  return (
    <div className="w-72 min-h-screen bg-slate-900 text-white flex flex-col justify-between">
      <div>
        <div className="px-6 py-6 border-b border-white/10">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="mt-1 text-sm text-slate-300">CRM Control Center</p>
        </div>

        <div className="p-4">
          <Link to="/admin/profile">
            <div className="rounded-3xl bg-white/10 p-5 border border-white/10 hover:bg-white/15 transition">
              <div className="flex flex-col items-center text-center">
                <img
                  src={user?.profileImage || "https://i.pravatar.cc/150?img=12"}
                  alt="profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
                />
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">{user?.name || "Admin"}</h3>
                  <p className="text-sm text-slate-300 capitalize">
                    {user?.role || "admin"}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <nav className="px-3 space-y-2">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;