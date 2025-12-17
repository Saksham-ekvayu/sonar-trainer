import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import ScenarioSetup from "@/pages/ScenarioSetup";
import Environment from "@/pages/Environment";
import Equipment from "@/pages/Equipment";
import Propagation from "@/pages/Propagation";
import SonarEquation from "@/pages/SonarEquation";
import SignalProcessing from "@/pages/SignalProcessing";
import TargetStrength from "@/pages/TargetStrength";
import Visualization from "@/pages/Visualization";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scenario-setup" element={<ScenarioSetup />} />
            <Route path="/environment" element={<Environment />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/propagation" element={<Propagation />} />
            <Route path="/sonar-equation" element={<SonarEquation />} />
            <Route path="/signal-processing" element={<SignalProcessing />} />
            <Route path="/target-strength" element={<TargetStrength />} />
            <Route path="/visualization" element={<Visualization />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
