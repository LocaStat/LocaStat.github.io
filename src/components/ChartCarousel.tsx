import { useState, useEffect } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
import { ChartData } from "./HistogramPlot";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChartCarouselProps {
  charts: ChartData[];
  onRemoveChart: (chartId: string) => void;
}

export const ChartCarousel = ({ charts, onRemoveChart }: ChartCarouselProps) => {
  const [api, setApi] = useState<any>(null);
  const [chartToDelete, setChartToDelete] = useState<string | null>(null);

  // Sort charts by createdAt (latest first)
  const sortedCharts = [...charts].sort((a, b) => b.createdAt - a.createdAt);

  useEffect(() => {
    if (!api) {
      return;
    }

    // Scroll to first item when charts change
    if (sortedCharts.length > 0) {
      api.scrollTo(0);
    }
  }, [api, sortedCharts.length]);

  if (sortedCharts.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center text-muted-foreground">
          <p className="text-lg mb-2">No charts created yet</p>
          <p className="text-sm">
            Create a chart from the options above to see it here
          </p>
        </div>
      </Card>
    );
  }

  const renderChart = (chart: ChartData) => {
    switch (chart.type) {
      case "histogram":
        // Calculate number of bins for better tick spacing
        const numBins = chart.data.length;
        // Show fewer ticks on x-axis if there are many bins to avoid overlap
        // Show max 12 ticks on x-axis for readability
        const maxTicks = 12;
        const tickValues = numBins > maxTicks ? 
          chart.data.filter((_, i) => {
            const step = Math.ceil(numBins / maxTicks);
            return i % step === 0 || i === chart.data.length - 1;
          }).map(d => d.bin) :
          undefined;
        
        return (
          <div className="w-full h-[500px] min-h-[400px]">
            <ResponsiveBar
              data={chart.data}
              keys={["count"]}
              indexBy="bin"
              margin={{ top: 50, right: 50, bottom: numBins > 15 ? 120 : 100, left: 60 }}
              padding={0.3}
              valueScale={{ type: "linear" }}
              indexScale={{ type: "band", round: true }}
              colors={{ scheme: "nivo" }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: numBins > 20 ? -90 : -45,
                legend: chart.config.column || "Bin",
                legendPosition: "middle",
                legendOffset: numBins > 20 ? 100 : 80,
                tickValues: tickValues,
                format: (value) => {
                  // Abbreviate long bin labels for display
                  if (typeof value === 'string') {
                    // Handle [start, end) format
                    if (value.includes('[') && value.includes(')')) {
                      const match = value.match(/\[([^,]+),\s*([^)]+)\)/);
                      if (match) {
                        const start = parseFloat(match[1]);
                        const end = parseFloat(match[2]);
                        const precision = Math.abs(start) >= 10 || Math.abs(end) >= 10 ? 1 : 2;
                        return `[${start.toFixed(precision)}, ${end.toFixed(precision)})`;
                      }
                    }
                    // Truncate very long labels
                    if (value.length > 15) {
                      return value.substring(0, 12) + '...';
                    }
                  }
                  return value;
                },
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Frequency",
                legendPosition: "middle",
                legendOffset: -50,
              }}
              enableLabel={false}
              tooltip={(bar) => (
                <div
                  style={{
                    padding: "8px 12px",
                    background: "rgba(0, 0, 0, 0.8)",
                    color: "white",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                >
                  <strong>{bar.indexValue}</strong>
                  <br />
                  Count: {bar.value}
                </div>
              )}
              theme={{
                text: {
                  fill: "hsl(var(--foreground))",
                  fontSize: 11,
                },
                axis: {
                  domain: {
                    line: {
                      stroke: "hsl(var(--border))",
                      strokeWidth: 1,
                    },
                  },
                  ticks: {
                    line: {
                      stroke: "hsl(var(--border))",
                      strokeWidth: 1,
                    },
                    text: {
                      fill: "hsl(var(--foreground))",
                      fontSize: 10,
                    },
                  },
                  legend: {
                    text: {
                      fill: "hsl(var(--foreground))",
                      fontSize: 12,
                    },
                  },
                },
                grid: {
                  line: {
                    stroke: "hsl(var(--border))",
                    strokeWidth: 1,
                  },
                },
              }}
            />
          </div>
        );
      default:
        return (
          <div className="text-center text-muted-foreground p-8">
            Unknown chart type: {chart.type}
          </div>
        );
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">
          Charts ({sortedCharts.length})
        </h3>
        <p className="text-sm text-muted-foreground">
          Navigate through your charts. Latest charts appear first.
        </p>
      </div>

      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {sortedCharts.map((chart) => (
            <CarouselItem key={chart.id}>
              <Card className="p-4 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-10 h-8 w-8 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  onClick={() => setChartToDelete(chart.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="mb-4">
                  <h4 className="text-lg font-semibold">{chart.title}</h4>
                  {chart.type === "histogram" && chart.config && (
                    <p className="text-sm text-muted-foreground">
                      Range: {chart.config.min.toFixed(2)} - {chart.config.max.toFixed(2)} | 
                      Total values: {chart.config.totalValues} | 
                      Bins: {chart.config.numBins}
                    </p>
                  )}
                </div>
                <div className="bg-background rounded-lg border border-border p-4">
                  {renderChart(chart)}
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {sortedCharts.length > 1 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>

      <AlertDialog open={chartToDelete !== null} onOpenChange={(open) => !open && setChartToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chart</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this chart? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (chartToDelete) {
                  onRemoveChart(chartToDelete);
                  setChartToDelete(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
