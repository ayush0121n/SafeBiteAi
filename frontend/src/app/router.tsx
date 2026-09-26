import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "../pages/LandingPage";
import { DashboardPage } from "../pages/DashboardPage";
import { OnboardingPage } from "../pages/OnboardingPage";
import { NewScanPage } from "../pages/NewScanPage";
import { ScanProcessingPage } from "../pages/ScanProcessingPage";
import { ScanResultsPage } from "../pages/ScanResultsPage";
import { MealResultsPage } from "../pages/MealResultsPage";
import { ScanHistoryPage } from "../pages/ScanHistoryPage";
import { ProfilePage } from "../pages/ProfilePage";
import { OfflineCheckPage } from "../pages/OfflineCheckPage";
import { AdminLoginPage } from "../pages/AdminLoginPage";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import { LoginPage } from "../pages/LoginPage";
import { SignupPage } from "../pages/SignupPage";
import { FeaturesHubPage } from "../pages/FeaturesHubPage";
import { FeatureDetailsPage } from "../pages/FeatureDetailsPage";
import { AppShell } from "../components/layout/AppShell";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/onboarding",
    element: <OnboardingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/admin",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboardPage />,
  },
  {
    element: <AppShell />,
    children: [
      { path: "/app", element: <DashboardPage /> },
      { path: "/app/scan", element: <NewScanPage /> },
      { path: "/app/scan/:scanId/processing", element: <ScanProcessingPage /> },
      { path: "/app/scan/:scanId", element: <ScanResultsPage /> },
      { path: "/app/meal/results", element: <MealResultsPage /> },
      { path: "/app/history", element: <ScanHistoryPage /> },
      { path: "/app/profile", element: <ProfilePage /> },
      { path: "/app/features", element: <FeaturesHubPage /> },
      { path: "/app/features/:featureId", element: <FeatureDetailsPage /> },
      { path: "/app/offline-check", element: <OfflineCheckPage /> },
    ],
  },
]);
