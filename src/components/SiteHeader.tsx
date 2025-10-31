import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Github, Heart } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useCallback } from "react";

const SiteHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showExitDialog, setShowExitDialog] = useState(false);

  const handleLogoClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      // Only confirm if analysis data exists and we're not already on home
      const hasAnalysis = !!sessionStorage.getItem("parsedData");
      if (hasAnalysis && location.pathname !== "/") {
        setShowExitDialog(true);
      } else {
        navigate("/");
      }
    },
    [location.pathname, navigate]
  );

  const handleConfirmExit = useCallback(() => {
    setShowExitDialog(false);
    navigate("/");
  }, [navigate]);

  return (
    <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="LocaStat Logo" className="h-8 w-8" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-[hsl(var(--primary-glow))] bg-clip-text text-transparent">LocaStat</h1>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open("https://github.com/LocaStat/LocaStat.github.io", "_blank")}
            className="flex items-center gap-2 bg-zinc-50 text-zinc-900 border-zinc-200 md:bg-background md:text-foreground md:border-input md:hover:bg-zinc-50 md:hover:text-zinc-900 md:hover:border-zinc-200"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open("https://buymeacoffee.com/LocaStat", "_blank")}
            className="flex items-center gap-2 bg-rose-50 text-rose-700 border-rose-300 md:bg-background md:text-foreground md:border-input md:hover:bg-rose-100 md:hover:text-rose-700 md:hover:border-rose-300"
          >
            <Heart className="h-4 w-4 text-red-500" />
            <span className="hidden sm:inline">Support</span>
          </Button>
          <Link to="/app">
            <Button variant="hero" size="sm">
              Try Now
            </Button>
          </Link>
        </div>
      </div>

      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Data Warning</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved data processing in progress. Leaving now will lose any unsaved changes. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay Here</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmExit}>Leave Anyway</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default SiteHeader;


