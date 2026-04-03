import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserDashboard from "../pages/user/UserDashboard";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Home from "../pages/Home";
import UserLeads from "../pages/user/UserLeads";
import UserDeals from "../pages/user/UserDeals";
import UserContacts from "../pages/user/UserContacts";
import UserCompanies from "../pages/user/UserCompanies";
import UserEmailTemplates from "../pages/user/UserEmailTemplates";
import UserFollowups from "../pages/user/UserFollowups";
import Features from "../pages/footerpages/Features";
import Pricing from "../pages/footerpages/Pricing";
import Integration from "../pages/footerpages/Integration";
import Documentation from "../pages/footerpages/Documentation";
import HelpCenter from "../pages/footerpages/HelpCenter";
import SystemStatus from "../pages/footerpages/SystemStatus";
import About from "../pages/footerpages/About";
import PrivacyPolicy from "../pages/footerpages/PrivacyPolicy";
import ContactSales from "../pages/footerpages/ContactSales";
import UserProfile from "../pages/user/UserProfile";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminRequests from "../pages/admin/AdminRequests";
import AdminActivity from "../pages/admin/AdminActivity";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={< Home />} />
        <Route path="/home" element={< Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/integrations" element={<Integration/>} />
        <Route path="/docs" element={<Documentation />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/status" element={<SystemStatus />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/contact" element={<ContactSales />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/requests" element={<AdminRequests />} />
        <Route path="/admin/activity" element={<AdminActivity />} />




        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
        path="/user/leads"
        element={
          <ProtectedRoute allowedRole="user">
            <UserLeads />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/deals"
        element={
          <ProtectedRoute allowedRole="user">
            <UserDeals />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/contacts"
        element={
          <ProtectedRoute allowedRole="user">
            <UserContacts />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/companies"
        element={
          <ProtectedRoute allowedRole="user">
            <UserCompanies />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/templates"
        element={
          <ProtectedRoute allowedRole="user">
            <UserEmailTemplates />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/followups"
        element={
          <ProtectedRoute allowedRole="user">
            <UserFollowups />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/profile"
        element={<UserProfile />}
      />



      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;