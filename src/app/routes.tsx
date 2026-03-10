import { createBrowserRouter } from "react-router";
import { LoginPage } from "./pages/LoginPage";
import { DashboardLayout } from "./pages/DashboardLayout";
import { DashboardHome } from "./pages/DashboardHome";
import { CircuitsPage } from "./pages/CircuitsPage";
import { CircuitDetailPage } from "./pages/CircuitDetailPage";
import { LapTimesPage } from "./pages/LapTimesPage";
import { TirePressurePage } from "./pages/TirePressurePage";
import { PitStopChallengePage } from "./pages/PitStopChallengePage";
import { PracticeModePage } from "./pages/PracticeModePage";
import { AgendaPage } from "./pages/AgendaPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      { index: true, Component: DashboardHome },
      { path: "circuits", Component: CircuitsPage },
      { path: "circuits/:circuitId", Component: CircuitDetailPage },
      { path: "circuits/:circuitId/lap-times", Component: LapTimesPage },
      { path: "circuits/:circuitId/tire-pressure", Component: TirePressurePage },
      { path: "pitstop-challenge", Component: PitStopChallengePage },
      { path: "practice", Component: PracticeModePage },
      { path: "agenda", Component: AgendaPage },
    ],
  },
]);
