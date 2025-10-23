import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Columns3, BarChart3, Calculator, Download, Info } from "lucide-react";
import { ParsedData } from "@/pages/App";

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
          <PlaceholderTab
            title="Column Selection"
            description="Select specific columns from your dataset for analysis"
            icon={Columns3}
          >
            <div className="space-y-2">
              <p className="text-sm font-medium mb-3">Available columns:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {parsedData.headers.map((header, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded border border-border/50 bg-secondary/20"
                  >
                    <input type="checkbox" disabled className="rounded" />
                    <span className="text-sm truncate">{header || `Column ${idx + 1}`}</span>
                  </div>
                ))}
              </div>
            </div>
          </PlaceholderTab>
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
