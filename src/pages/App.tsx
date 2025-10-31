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
  const [isDataPreviewCollapsed, setIsDataPreviewCollapsed] = useState(false);

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

  // Collapse Data Preview when Column Selection or Data Visualizations are accessed
  useEffect(() => {
    if (activeTab === "columns" || activeTab === "plots") {
      setIsDataPreviewCollapsed(true);
    } else if (activeTab === "preview") {
      setIsDataPreviewCollapsed(false);
    }
  }, [activeTab]);

  // Typeform script is loaded globally in index.html

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
              isCollapsed={isDataPreviewCollapsed}
            />
            <TabNavigation
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                if (tab === "columns" || tab === "plots") {
                  setIsDataPreviewCollapsed(true);
                }
              }}
              parsedData={parsedData}
              includedColumns={includedColumns}
              excludedColumns={excludedColumns}
              onIncludedColumnsChange={setIncludedColumns}
              onExcludedColumnsChange={setExcludedColumns}
              onVisualizationClick={() => setIsDataPreviewCollapsed(true)}
            />
          </div>
        )}
      </main>

      {/* Typeform embed moved into the Feedback tab */}

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
