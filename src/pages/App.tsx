import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { FileUploadZone } from "@/components/FileUploadZone";
import { DataPreview } from "@/components/DataPreview";
import { TabNavigation } from "@/components/TabNavigation";
import { toast } from "sonner";

export interface ParsedData {
  fileName: string;
  rows: number;
  columns: number;
  headers: string[];
  preview: string[][];
  sheetName?: string;
}

const App = () => {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [activeTab, setActiveTab] = useState<string>("preview");

  const handleFileUpload = (data: ParsedData) => {
    setParsedData(data);
    setActiveTab("preview");
    toast.success("File uploaded successfully!");
  };

  const handleClearData = () => {
    setParsedData(null);
    setActiveTab("preview");
    sessionStorage.clear();
    toast.info("Data cleared");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/95">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="LocaStat Logo" className="h-8 w-8" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-[hsl(var(--primary-glow))] bg-clip-text text-transparent">
                LocaStat Offline
              </h1>
            </div>
          </div>
          {parsedData && (
            <Button variant="outline" size="sm" onClick={handleClearData}>
              Clear Data
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
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
            <DataPreview data={parsedData} />
            <TabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              parsedData={parsedData}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
