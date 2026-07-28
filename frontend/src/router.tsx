//src/outrer.ts
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import DashboardPage from "./pages/dashboard/DashboardPage";
import PatientsPage from "./pages/PatientsPage";
import PatientOverviewPage from "./pages/PatientOverviewPage";
import JournalPage from "./pages/JournalPage";
import MedicationsPage from "./pages/MedicationsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import UnitOverviewPage from "./pages/UnitOverviewPage";
import LabWorklistPage from "./pages/LabWorklistPage";
import ConsentManagementPage from "./pages/ConsentManagementPage";
import ConsentManagementLandingPage from "./pages/ConsentManagementLandingPage";
import LoginPage from "./pages/LoginPage";
import RadiologyWorklistPage from "./pages/RadiologyWorklistPage";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <DashboardPage /> },

      { path: "patients", element: <PatientsPage /> },
      { path: "patients/:patientId", element: <PatientOverviewPage /> },
      { path: "patients/:patientId/journal", element: <JournalPage /> },
      { path: "patients/:patientId/medications", element: <MedicationsPage /> },
      { path: "patients/:patientId/appointments", element: <AppointmentsPage /> },
      { path: "patients/:patientId/consents", element: <ConsentManagementPage /> },
      
      { path: "consent-management", element: <ConsentManagementLandingPage /> },
      
      { path: "appointments", element: <AppointmentsPage /> },
      { path: "unit-overview", element: <UnitOverviewPage /> },
      { path: "laboratory", element: <LabWorklistPage /> },
      { path: "radiology", element: <RadiologyWorklistPage /> },

      { path: "login", element: <LoginPage /> },
    ],
  },
]);
