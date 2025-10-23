import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Columns3, BarChart3, Calculator, Download, Info, Search, Check } from "lucide-react";
import { ParsedData } from "@/pages/App";
import { useState, useEffect } from "react";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  parsedData: ParsedData;
}

export const TabNavigation = ({ activeTab, onTabChange, parsedData }: TabNavigationProps) => {
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
          <ColumnSelectionTab parsedData={parsedData} />
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
          <PlaceholderTab
            title="Data Export"
            description="Export your processed data in various formats"
            icon={Download}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {["CSV", "Excel (XLSX)", "JSON"].map((format) => (
                <div
                  key={format}
                  className="p-6 border border-border rounded-lg text-center hover:border-primary/50 transition-colors"
                >
                  <Download className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="font-medium">{format}</p>
                </div>
              ))}
            </div>
          </PlaceholderTab>
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
}

const ColumnSelectionTab = ({ parsedData }: ColumnSelectionTabProps) => {
  const [includedColumns, setIncludedColumns] = useState<string[]>([]);
  const [excludedColumns, setExcludedColumns] = useState<string[]>([]);
  const [includeFilter, setIncludeFilter] = useState("");
  const [excludeFilter, setExcludeFilter] = useState("");

  // Initialize with first 20 columns as included
  useEffect(() => {
    const allColumns = parsedData.headers.map((header, idx) => header || `Column ${idx + 1}`);
    const first20 = allColumns.slice(0, 20);
    const rest = allColumns.slice(20);
    setIncludedColumns(first20);
    setExcludedColumns(rest);
  }, [parsedData.headers]);

  const handleMoveToExcluded = (column: string) => {
    setIncludedColumns(prev => prev.filter(col => col !== column));
    setExcludedColumns(prev => [...prev, column]);
  };

  const handleMoveToIncluded = (column: string) => {
    setExcludedColumns(prev => prev.filter(col => col !== column));
    setIncludedColumns(prev => [...prev, column]);
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
              {filteredExcluded.map((column, idx) => (
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
          </div>
        </div>
      </div>
    </Card>
  );
};
