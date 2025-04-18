"use client"

import { createBrowserRouter } from "react-router-dom"
import { QueryProvider } from "./providers/query-provider"
import { AuthProvider } from "./contexts/auth-context"
import { DonationProvider } from "./contexts/donation-context"
import { NotificationProvider } from "./contexts/notification-context"
import { ThemeProvider } from "./contexts/theme-context"
import { MainLayout } from "./components/layout/MainLayout"
import { Home } from "./pages/Home"
import { Login } from "./pages/auth/Login"
import { Register } from "./pages/auth/Register"
import { Dashboard } from "./pages/Dashboard"
import { DonorDashboard } from "./pages/donor/Dashboard"
import { NgoDashboard } from "./pages/ngo/Dashboard"
import { VolunteerDashboard } from "./pages/volunteer/Dashboard"
import { AdminDashboard } from "./pages/admin/Dashboard"
import { NotFound } from "./pages/NotFound"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { RoleRoute } from "./components/auth/RoleRoute"

// Common Pages
import AboutPage from "./pages/common/AboutPage"
import ContactPage from "./pages/common/ContactPage"

// Donor Pages
import DonorDonationsPage from "./pages/donor/DonationsPage"
import DonorCreateDonationPage from "./pages/donor/CreateDonationPage"
import DonorProfilePage from "./pages/donor/ProfilePage"

// NGO Pages
import NgoDonationsPage from "./pages/ngo/DonationsPage"
import NgoProfilePage from "./pages/ngo/ProfilePage"

// Volunteer Pages
import VolunteerAssignmentsPage from "./pages/volunteer/AssignmentsPage"
import VolunteerProfilePage from "./pages/volunteer/ProfilePage"

// Admin Pages
import AdminUsersPage from "./pages/admin/UsersPage"
import AdminDonationsPage from "./pages/admin/DonationsPage"
import AdminReportsPage from "./pages/admin/ReportsPage"

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="system">
        <AuthProvider>
          <DonationProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </DonationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppProviders>
        <MainLayout />
      </AppProviders>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "donor",
        element: (
          <RoleRoute role="donor">
            <DonorDashboard />
          </RoleRoute>
        ),
      },
      {
        path: "ngo",
        element: (
          <RoleRoute role="ngo">
            <NgoDashboard />
          </RoleRoute>
        ),
      },
      {
        path: "volunteer",
        element: (
          <RoleRoute role="volunteer">
            <VolunteerDashboard />
          </RoleRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <RoleRoute role="admin">
            <AdminDashboard />
          </RoleRoute>
        ),
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
])
