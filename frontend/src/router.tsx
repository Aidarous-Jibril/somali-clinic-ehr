import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import JournalPage from "./pages/JournalPage";
import MedicationsPage from "./pages/MedicationsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import UnitOverviewPage from "./pages/UnitOverviewPage";
import SamplingDataPage from "./pages/SamplingDataPage";
import ConsentManagementPage from "./pages/ConsentManagementPage";
import PatientOverviewPage from "./pages/PatientOverviewPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "patients", element: <PatientOverviewPage /> },
      { path: "patients/:patientId", element: <PatientOverviewPage /> },
      { path: "journal", element: <JournalPage /> },
      { path: "medications", element: <MedicationsPage /> },
      { path: "appointments", element: <AppointmentsPage /> },
      { path: "unit-overview", element: <UnitOverviewPage /> },
      { path: "sampling-data", element: <SamplingDataPage />},
      { path: "/consent-management", element: <ConsentManagementPage />} 
    ],
  },
]);
