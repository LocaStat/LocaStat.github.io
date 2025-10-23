import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Columns3, BarChart3, Calculator, Download, Info, Search, Check, FileDown } from "lucide-react";
import { ParsedData } from "@/pages/App";
import { useState, useEffect } from "react";
import { downloadCSV, downloadJSON, downloadExcel } from "@/lib/exportUtils";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  parsedData: ParsedData;
  includedColumns: string[];
  excludedColumns: string[];
  onIncludedColumnsChange: (columns: string[]) => void;
  onExcludedColumnsChange: (columns: string[]) => void;
}

export const TabNavigation = ({ 
  activeTab, 
  onTabChange, 
  parsedData, 
  includedColumns, 
  excludedColumns, 
  onIncludedColumnsChange, 
  onExcludedColumnsChange 
}: TabNavigationProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2 bg-transparent">
        <TabsTrigger
          value="columns"
          className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Columns3 className="h-4 w-4" />
          <span className="hidden sm:inline">Column Selection</span>
          <span className="sm:hidden">Columns</span>
        </TabsTrigger>
        <TabsTrigger
          value="plots"
          className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline">Plots</span>
          <span className="sm:hidden">Plots</span>
        </TabsTrigger>
        <TabsTrigger
          value="analysis"
          className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Calculator className="h-4 w-4" />
          <span className="hidden sm:inline">Analysis</span>
          <span className="sm:hidden">Stats</span>
        </TabsTrigger>
        <TabsTrigger
          value="export"
          className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
          <span className="sm:hidden">Export</span>
        </TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="columns" className="space-y-4">
          <ColumnSelectionTab 
            parsedData={parsedData}
            includedColumns={includedColumns}
            excludedColumns={excludedColumns}
            onIncludedColumnsChange={onIncludedColumnsChange}
            onExcludedColumnsChange={onExcludedColumnsChange}
          />
        </TabsContent>

        <TabsContent value="plots" className="space-y-4">
          <PlaceholderTab
            title="Plots & Visualization"
            description="Generate various charts and visualizations from your data"
            icon={BarChart3}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Histogram", "Scatter Plot", "Line Chart", "Box Plot"].map((type) => (
                <div
                  key={type}
                  className="p-4 border border-border rounded-lg text-center hover:border-primary/50 transition-colors"
                >
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">{type}</p>
                </div>
              ))}
            </div>
          </PlaceholderTab>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <PlaceholderTab
            title="Statistical Analysis"
            description="Run comprehensive statistical analyses on your dataset"
            icon={Calculator}
          >
            <div className="space-y-3">
              {[
                "Summary Statistics",
                "Correlation Analysis",
                "Distribution Analysis",
                "Hypothesis Testing",
              ].map((analysis) => (
                <div
                  key={analysis}
                  className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <p className="font-medium">{analysis}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Feature coming in future release
                  </p>
                </div>
              ))}
            </div>
          </PlaceholderTab>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <DataExportTab 
            parsedData={parsedData}
            includedColumns={includedColumns}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};

interface PlaceholderTabProps {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const PlaceholderTab = ({ title, description, icon: Icon, children }: PlaceholderTabProps) => {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold">{title}</h3>
              <Badge variant="secondary" className="text-xs">
                Coming Soon
              </Badge>
            </div>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
        
        <div className="bg-secondary/30 border border-border/50 rounded-lg p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">Feature Preview</p>
            <p className="text-muted-foreground">
              This feature is currently in development. The interface below shows what will be
              available in future releases.
            </p>
          </div>
        </div>
      </div>

      <div className="opacity-60 pointer-events-none">{children}</div>
    </Card>
  );
};

interface ColumnSelectionTabProps {
  parsedData: ParsedData;
  includedColumns: string[];
  excludedColumns: string[];
  onIncludedColumnsChange: (columns: string[]) => void;
  onExcludedColumnsChange: (columns: string[]) => void;
}

const ColumnSelectionTab = ({ 
  parsedData, 
  includedColumns, 
  excludedColumns, 
  onIncludedColumnsChange, 
  onExcludedColumnsChange 
}: ColumnSelectionTabProps) => {
  const [includeFilter, setIncludeFilter] = useState("");
  const [excludeFilter, setExcludeFilter] = useState("");
  const [showAllExcluded, setShowAllExcluded] = useState(false);

  // Initialize with first 20 columns as included if no columns are set
  useEffect(() => {
    if (includedColumns.length === 0 && excludedColumns.length === 0) {
      const allColumns = parsedData.headers.map((header, idx) => header || `Column ${idx + 1}`);
      const first20 = allColumns.slice(0, 20);
      const rest = allColumns.slice(20);
      onIncludedColumnsChange(first20);
      onExcludedColumnsChange(rest);
    }
  }, [parsedData.headers, includedColumns.length, excludedColumns.length, onIncludedColumnsChange, onExcludedColumnsChange]);

  const handleMoveToExcluded = (column: string) => {
    onIncludedColumnsChange(includedColumns.filter(col => col !== column));
    onExcludedColumnsChange([...excludedColumns, column]);
  };

  const handleMoveToIncluded = (column: string) => {
    onExcludedColumnsChange(excludedColumns.filter(col => col !== column));
    onIncludedColumnsChange([...includedColumns, column]);
  };

  const handleAddAllIncluded = () => {
    if (includeFilter && includedColumns.length > 0) {
      const filteredColumns = includedColumns.filter(col => 
        col.toLowerCase().includes(includeFilter.toLowerCase())
      );
      filteredColumns.forEach(col => handleMoveToExcluded(col));
      setIncludeFilter("");
    }
  };

  const handleAddAllExcluded = () => {
    if (excludeFilter && excludedColumns.length > 0) {
      const filteredColumns = excludedColumns.filter(col => 
        col.toLowerCase().includes(excludeFilter.toLowerCase())
      );
      filteredColumns.forEach(col => handleMoveToIncluded(col));
      setExcludeFilter("");
    }
  };

  const filteredIncluded = includedColumns.filter(col => 
    col.toLowerCase().includes(includeFilter.toLowerCase())
  );

  const filteredExcluded = excludedColumns.filter(col => 
    col.toLowerCase().includes(excludeFilter.toLowerCase())
  );

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <Columns3 className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">Column Selection</h3>
            <p className="text-muted-foreground">Select specific columns from your dataset for analysis</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Included Columns Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium">Included Columns ({includedColumns.length})</h4>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter included columns..."
                value={includeFilter}
                onChange={(e) => setIncludeFilter(e.target.value)}
                className="pl-10"
              />
            </div>
            {includeFilter && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddAllIncluded}
                className="flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                Exclude All
              </Button>
            )}
          </div>

          <div className="border border-border/50 rounded-lg p-4 min-h-[120px]">
            <div className="flex flex-wrap gap-2">
              {filteredIncluded.map((column, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors px-3 py-1"
                  onClick={() => handleMoveToExcluded(column)}
                >
                  {column}
                </Badge>
              ))}
              {filteredIncluded.length === 0 && includeFilter && (
                <p className="text-muted-foreground text-sm">No columns match the filter</p>
              )}
            </div>
          </div>
        </div>

        {/* Excluded Columns Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium">Excluded Columns ({excludedColumns.length})</h4>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter excluded columns..."
                value={excludeFilter}
                onChange={(e) => setExcludeFilter(e.target.value)}
                className="pl-10"
              />
            </div>
            {excludeFilter && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddAllExcluded}
                className="flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                Include All
              </Button>
            )}
          </div>

          <div className="border border-border/50 rounded-lg p-4 min-h-[120px]">
            <div className="flex flex-wrap gap-2">
              {filteredExcluded.slice(0, showAllExcluded ? filteredExcluded.length : 100).map((column, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1"
                  onClick={() => handleMoveToIncluded(column)}
                >
                  {column}
                </Badge>
              ))}
              {filteredExcluded.length === 0 && excludeFilter && (
                <p className="text-muted-foreground text-sm">No columns match the filter</p>
              )}
            </div>
            
            {filteredExcluded.length > 100 && !showAllExcluded && (
              <div className="mt-4 flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllExcluded(true)}
                  className="flex items-center gap-2"
                >
                  See all ({filteredExcluded.length} columns)
                </Button>
              </div>
            )}
            
            {showAllExcluded && filteredExcluded.length > 100 && (
              <div className="mt-4 flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllExcluded(false)}
                  className="flex items-center gap-2"
                >
                  Show less
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

interface DataExportTabProps {
  parsedData: ParsedData;
  includedColumns: string[];
}

const DataExportTab = ({ parsedData, includedColumns }: DataExportTabProps) => {
  const hasFilteredColumns = includedColumns.length > 0;
  const totalColumns = parsedData.headers.length;

  const handleCSVDownload = () => {
    if (hasFilteredColumns) {
      downloadCSV(parsedData, includedColumns);
    } else {
      // Download all columns if no filtering
      const allColumns = parsedData.headers.map((header, idx) => header || `Column ${idx + 1}`);
      downloadCSV(parsedData, allColumns);
    }
  };

  const handleJSONDownload = () => {
    if (hasFilteredColumns) {
      downloadJSON(parsedData, includedColumns);
    } else {
      // Download all columns if no filtering
      const allColumns = parsedData.headers.map((header, idx) => header || `Column ${idx + 1}`);
      downloadJSON(parsedData, allColumns);
    }
  };

  const handleExcelDownload = () => {
    if (hasFilteredColumns) {
      downloadExcel(parsedData, includedColumns);
    } else {
      // Download all columns if no filtering
      const allColumns = parsedData.headers.map((header, idx) => header || `Column ${idx + 1}`);
      downloadExcel(parsedData, allColumns);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <Download className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">Data Export</h3>
            <p className="text-muted-foreground">
              Export your processed data in various formats
            </p>
          </div>
        </div>
        
        {hasFilteredColumns && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3 mb-6">
            <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Filtered Data Export</p>
              <p className="text-muted-foreground">
                Exporting {includedColumns.length} of {totalColumns} columns. 
                Only the selected columns will be included in the exported file.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 border border-border rounded-lg text-center hover:border-primary/50 transition-colors">
          <FileDown className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="font-medium mb-2">CSV Format</p>
          <p className="text-sm text-muted-foreground mb-4">
            Comma-separated values, compatible with Excel and most data tools
          </p>
          <Button onClick={handleCSVDownload} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download CSV
          </Button>
        </div>

        <div className="p-6 border border-border rounded-lg text-center hover:border-primary/50 transition-colors">
          <FileDown className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="font-medium mb-2">JSON Format</p>
          <p className="text-sm text-muted-foreground mb-4">
            JavaScript Object Notation, ideal for web applications and APIs
          </p>
          <Button onClick={handleJSONDownload} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download JSON
          </Button>
        </div>

        <div className="p-6 border border-border rounded-lg text-center hover:border-primary/50 transition-colors">
          <FileDown className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="font-medium mb-2">Excel Format</p>
          <p className="text-sm text-muted-foreground mb-4">
            Microsoft Excel format, preserves formatting and data types
          </p>
          <Button onClick={handleExcelDownload} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download Excel
          </Button>
        </div>
      </div>

      {!hasFilteredColumns && (
        <div className="mt-6 bg-secondary/30 border border-border/50 rounded-lg p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">Export All Data</p>
            <p className="text-muted-foreground">
              No columns have been filtered. All {totalColumns} columns will be exported. 
              Use the Column Selection tab to filter specific columns before exporting.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};
