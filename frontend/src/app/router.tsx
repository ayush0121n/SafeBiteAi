import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "../pages/LandingPage";
import { DashboardPage } from "../pages/DashboardPage";
import { OnboardingPage } from "../pages/OnboardingPage";
import { NewScanPage } from "../pages/NewScanPage";
import { ScanProcessingPage } from "../pages/ScanProcessingPage";
import { ScanResultsPage } from "../pages/ScanResultsPage";
import { ScanHistoryPage } from "../pages/ScanHistoryPage";
import { ProfilePage } from "../pages/ProfilePage";
import { OfflineCheckPage } from "../pages/OfflineCheckPage";
import { AdminLoginPage } from "../pages/AdminLoginPage";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import { LoginPage } from "../pages/LoginPage";
import { SignupPage } from "../pages/SignupPage";
import { FeaturesHubPage } from "../pages/FeaturesHubPage";
import { FeatureDetailsPage } from "../pages/FeatureDetailsPage";
import { SearchPage } from "../pages/SearchPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { MealResultsPage } from "../pages/MealResultsPage";
import { LearnPage } from "../pages/LearnPage";
import { AppShell } from "../components/layout/AppShell";
import { GlobalErrorBoundary } from "../components/layout/GlobalErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <GlobalErrorBoundary />,
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
    errorElement: <GlobalErrorBoundary />,
    children: [
      { path: "/app", element: <DashboardPage /> },
      { path: "/app/search", element: <SearchPage /> },
      { path: "/app/product/:productId", element: <ProductDetailPage /> },
      { path: "/app/scan", element: <NewScanPage /> },
      { path: "/app/scan/:scanId/processing", element: <ScanProcessingPage /> },
      { path: "/app/scan/:scanId", element: <ScanResultsPage /> },
      { path: "/app/meal/results", element: <MealResultsPage /> },
      { path: "/app/history", element: <ScanHistoryPage /> },
      { path: "/app/profile", element: <ProfilePage /> },
      { path: "/app/features", element: <FeaturesHubPage /> },
      { path: "/app/features/:featureId", element: <FeatureDetailsPage /> },
      { path: "/app/learn", element: <LearnPage /> },
      { path: "/app/offline-check", element: <OfflineCheckPage /> },
    ],
  },
]);
