import { useEffect, useState } from "react";
import {
  FaUserEdit,
  FaLock,
  FaTrash,
  FaEnvelope,
  FaPhone,
  FaUser,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../../components/layout/UserSidebar";
import {
  getProfile,
  updateProfile,
  updatePassword,
  deleteAccount,
} from "../../services/profileService";
import { useAuth } from "../../context/AuthContext";

const UserProfile = () => {
  const navigate = useNavigate();
  const { logout, refreshUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    profileImage: "",
    bio: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfileData({
        name: data.user.name || "",
        email: data.user.email || "",
        role: data.user.role || "",
        phone: data.user.phone || "",
        profileImage: data.user.profileImage || "https://i.pravatar.cc/150?img=12",
        bio: data.user.bio || "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfileData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await updateProfile({
        name: profileData.name,
        phone: profileData.phone,
        profileImage: profileData.profileImage,
        bio: profileData.bio,
      });

      setMessage(res.message || "Profile updated successfully");
        await refreshUser();
        fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await updatePassword(passwordData);
      setMessage(res.message || "Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );
    if (!confirmed) return;

    try {
      await deleteAccount();
      await logout();
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <UserSidebar />
        <div className="flex flex-1 items-center justify-center text-slate-700">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <UserSidebar />

      <div className="flex-1 min-w-0 p-6 lg:p-8">
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 p-8 text-white shadow-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <img
              src={profileData.profileImage}
              alt="profile"
              className="h-28 w-28 rounded-full border-4 border-white/30 object-cover shadow-xl"
            />

            <div>
              <h1 className="text-3xl font-bold">{profileData.name}</h1>
              <p className="mt-2 text-indigo-100">{profileData.email}</p>
              <span className="mt-3 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-semibold capitalize">
                {profileData.role}
              </span>
            </div>
          </div>
        </div>

        {message && (
          <div className="mb-4 rounded-2xl bg-emerald-100 px-4 py-3 text-emerald-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2 rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="mb-5 flex items-center gap-3">
              <FaUserEdit className="text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-800">
                Edit Profile
              </h2>
            </div>

            <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  readOnly
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Profile Image URL
                </label>
                <input
                  type="text"
                  name="profileImage"
                  value={profileData.profileImage}
                  onChange={handleProfileChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Bio
                </label>
                <textarea
                  name="bio"
                  rows="4"
                  value={profileData.bio}
                  onChange={handleProfileChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="md:col-span-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 font-semibold text-white shadow-lg transition hover:opacity-95"
              >
                Update Profile
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <div className="mb-5 flex items-center gap-3">
                <FaUser className="text-cyan-600" />
                <h2 className="text-xl font-bold text-slate-800">
                  Profile Info
                </h2>
              </div>

              <div className="space-y-4 text-slate-700">
                <div className="flex items-center gap-3">
                  <FaUser className="text-slate-400" />
                  <span>{profileData.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-slate-400" />
                  <span>{profileData.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-slate-400" />
                  <span>{profileData.phone || "No phone added"}</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <div className="mb-5 flex items-center gap-3">
                <FaLock className="text-amber-600" />
                <h2 className="text-xl font-bold text-slate-800">
                  Update Password
                </h2>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Current Password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500"
                />

                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500"
                />

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 font-semibold text-white shadow-lg transition hover:opacity-95"
                >
                  Update Password
                </button>
              </form>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm border border-red-200">
              <div className="mb-4 flex items-center gap-3">
                <FaTrash className="text-red-600" />
                <h2 className="text-xl font-bold text-red-700">
                  Danger Zone
                </h2>
              </div>

              <p className="mb-4 text-sm text-slate-600">
                Deleting your account is permanent and cannot be undone.
              </p>

              <button
                onClick={handleDeleteAccount}
                className="w-full rounded-2xl bg-red-600 py-3 font-semibold text-white shadow-lg transition hover:bg-red-700"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;