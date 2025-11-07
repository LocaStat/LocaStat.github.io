import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import Index from "./pages/Index";
import AppPage from "./pages/App";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";

const queryClient = new QueryClient();

const HomepageBanner = () => {
  const location = useLocation();
  
  if (location.pathname !== "/") {
    return null;
  }

  return (
    <div className="border-b border-border/40 bg-gradient-to-r from-primary/5 to-[hsl(var(--primary-glow))]/5 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-center">
        <Link to="/app">
          <Button variant="hero" size="sm">
            Try Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

const AppRoot = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SiteHeader />
        <HomepageBanner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/app" element={<AppPage />} />
          <Route path="/privacy" element={<Privacy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default AppRoot;
