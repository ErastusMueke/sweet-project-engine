import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Properties from "@/pages/Properties";
import AddProperty from "@/pages/AddProperty";
import PropertyDetail from "@/pages/PropertyDetail";
import Tenants from "@/pages/Tenants";
import AddTenant from "@/pages/AddTenant";
import Payments from "@/pages/Payments";
import AddPayment from "@/pages/AddPayment";
import ReceiptView from "@/pages/ReceiptView";
import Expenses from "@/pages/Expenses";
import Reports from "@/pages/Reports";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/add" element={<AddProperty />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/tenants" element={<Tenants />} />
            <Route path="/tenants/add" element={<AddTenant />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/payments/add" element={<AddPayment />} />
            <Route path="/receipt/:id" element={<ReceiptView />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
