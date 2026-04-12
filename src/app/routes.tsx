import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { MainLayout } from "./components/layouts/MainLayout.js";
import { AdminLayout } from "./components/layouts/AdminLayout.js";
import { Login } from "./pages/Login.js";
import { Register } from "./pages/Register.js";
import { Models } from "./pages/Models.js";
import { ModelProfile } from "./pages/ModelProfile.js";
import { EditProfile } from "./pages/EditProfile.js";
import { SubscriptionPlans } from "./pages/SubscriptionPlans.js";
import { AdminDashboard } from "./pages/admin/Dashboard.js";
import { AdminUsers } from "./pages/admin/Users.js";
import { AdminBilling } from "./pages/admin/Billing.js";
import { AdminPlans } from "./pages/admin/Plans.js";
import { AdminCategories } from "./pages/admin/Categories.js";
import { AdminGenders } from "./pages/admin/Genders.js";
import { hasRole } from "./auth/session.js";

function RequireUserRole() {
  if (!hasRole("user")) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function RequireUserOrAdminRole() {
  if (!hasRole("user") && !hasRole("admin")) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function BlockUserFromModels() {
  if (hasRole("user") || hasRole("admin")) {
    return <Navigate to="/edit-profile" replace />;
  }

  return <Outlet />;
}

function RequireAdminRole() {
  if (!hasRole("admin")) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        Component: BlockUserFromModels,
        children: [
          { index: true, Component: Models },
          { path: "models", Component: Models },
          { path: "model/:id", Component: ModelProfile },
        ],
      },
      { path: "plans", Component: SubscriptionPlans },
      {
        Component: RequireUserOrAdminRole,
        children: [{ path: "edit-profile", Component: EditProfile }],
      },
    ],
  },
  {
    path: "/admin",
    Component: RequireAdminRole,
    children: [
      {
        Component: AdminLayout,
        children: [
          { index: true, Component: AdminDashboard },
          { path: "users", Component: AdminUsers },
          { path: "billing", Component: AdminBilling },
          { path: "plans", Component: AdminPlans },
          { path: "categories", Component: AdminCategories },
          { path: "genders", Component: AdminGenders },
        ],
      },
    ],
  },
]);
