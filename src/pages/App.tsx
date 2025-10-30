import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileUploadZone } from "@/components/FileUploadZone";
import { DataPreview } from "@/components/DataPreview";
import { TabNavigation } from "@/components/TabNavigation";
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
import { toast } from "sonner";
import { Github, Heart } from "lucide-react";

export interface ParsedData {
  fileName: string;
  rows: number;
  columns: number;
  headers: string[];
  preview: string[][];
  allData: string[][]; // Full dataset for export
  sheetName?: string;
}

const App = () => {
  const navigate = useNavigate();
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [includedColumns, setIncludedColumns] = useState<string[]>([]);
  const [excludedColumns, setExcludedColumns] = useState<string[]>([]);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Load persisted data on component mount
  useEffect(() => {
    const loadPersistedData = () => {
      try {
        // Load parsed data
        const savedParsedData = sessionStorage.getItem("parsedData");
        if (savedParsedData) {
          const parsed = JSON.parse(savedParsedData);
          setParsedData(parsed);
        }

        // Load app state
        const savedActiveTab = sessionStorage.getItem("activeTab");
        if (savedActiveTab) {
          setActiveTab(savedActiveTab);
        }

        const savedIncludedColumns = sessionStorage.getItem("includedColumns");
        if (savedIncludedColumns) {
          setIncludedColumns(JSON.parse(savedIncludedColumns));
        }

        const savedExcludedColumns = sessionStorage.getItem("excludedColumns");
        if (savedExcludedColumns) {
          setExcludedColumns(JSON.parse(savedExcludedColumns));
        }
      } catch (error) {
        console.error("Error loading persisted data:", error);
        // Clear corrupted data
        sessionStorage.clear();
      }
    };

    loadPersistedData();
  }, []);

  // Persist activeTab changes
  useEffect(() => {
    if (parsedData) {
      sessionStorage.setItem("activeTab", activeTab);
    }
  }, [activeTab, parsedData]);

  // Persist includedColumns changes
  useEffect(() => {
    if (parsedData) {
      if (includedColumns.length > 0) {
        sessionStorage.setItem("includedColumns", JSON.stringify(includedColumns));
      } else {
        sessionStorage.removeItem("includedColumns");
      }
    }
  }, [includedColumns, parsedData]);

  // Persist excludedColumns changes
  useEffect(() => {
    if (parsedData) {
      if (excludedColumns.length > 0) {
        sessionStorage.setItem("excludedColumns", JSON.stringify(excludedColumns));
      } else {
        sessionStorage.removeItem("excludedColumns");
      }
    }
  }, [excludedColumns, parsedData]);

  const handleFileUpload = (data: ParsedData) => {
    setParsedData(data);
    setActiveTab("preview");
    // Clear previous column selections when new file is uploaded
    setIncludedColumns([]);
    setExcludedColumns([]);
    // Clear previous column selections from sessionStorage
    sessionStorage.removeItem("includedColumns");
    sessionStorage.removeItem("excludedColumns");
    toast.success("File uploaded successfully!");
  };

  const handleClearData = () => {
    setParsedData(null);
    setActiveTab("preview");
    setIncludedColumns([]);
    setExcludedColumns([]);
    // Clear all persisted data
    sessionStorage.removeItem("parsedData");
    sessionStorage.removeItem("activeTab");
    sessionStorage.removeItem("includedColumns");
    sessionStorage.removeItem("excludedColumns");
    toast.info("Data cleared");
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (parsedData) {
      setShowExitDialog(true);
    } else {
      navigate("/");
    }
  };

  const handleConfirmExit = () => {
    setShowExitDialog(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/95">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <img src="/logo.png" alt="LocaStat Logo" className="h-8 w-8" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-[hsl(var(--primary-glow))] bg-clip-text text-transparent">
                LocaStat 
              </h1>
            </Link>
          </div>
          
          {/* Header Actions */}
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4">
        {!parsedData ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3">Upload Your Data</h2>
              <p className="text-muted-foreground">
                Start by uploading a CSV or Excel file to explore your data
              </p>
            </div>
            <FileUploadZone onFileUpload={handleFileUpload} />
            <div className="mt-8 bg-secondary/30 rounded-xl p-6">
              <h3 className="font-semibold mb-3">Accepted Formats:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• CSV files (.csv) - UTF-8 encoded</li>
                <li>• Excel files (.xlsx) - All sheets available</li>
                <li>• Maximum file size: 10 MB</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <DataPreview 
              data={parsedData} 
              includedColumns={includedColumns}
              excludedColumns={excludedColumns}
              onClearData={handleClearData}
            />
            <TabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              parsedData={parsedData}
              includedColumns={includedColumns}
              excludedColumns={excludedColumns}
              onIncludedColumnsChange={setIncludedColumns}
              onExcludedColumnsChange={setExcludedColumns}
            />
          </div>
        )}
      </main>

      {/* Exit Confirmation Dialog */}
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
            <AlertDialogAction onClick={handleConfirmExit}>
              Leave Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default App;
