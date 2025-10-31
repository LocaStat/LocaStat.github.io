import { useState } from "react";
import { Bar } from "@nivo/bar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ParsedData } from "@/pages/App";
import { BarChart3 } from "lucide-react";

interface HistogramPlotProps {
  parsedData: ParsedData;
  onChartCreate: (chart: ChartData) => void;
}

export interface ChartData {
  id: string;
  type: string;
  title: string;
  data: any;
  config: any;
  createdAt: number;
}

export const HistogramPlot = ({ parsedData, onChartCreate }: HistogramPlotProps) => {
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [numBins, setNumBins] = useState<number>(20);

  // Get numeric columns only
  const getNumericColumns = () => {
    const numericColumns: string[] = [];
    
    parsedData.headers.forEach((header, colIndex) => {
      // Check if column contains numeric data
      let numericCount = 0;
      let totalCount = 0;
      
      // Check first 100 rows to determine if column is numeric
      const rowsToCheck = Math.min(100, parsedData.allData.length);
      for (let i = 0; i < rowsToCheck; i++) {
        const value = parsedData.allData[i]?.[colIndex];
        if (value && value.toString().trim() !== "") {
          totalCount++;
          const numValue = parseFloat(value.toString().trim());
          if (!isNaN(numValue) && isFinite(numValue)) {
            numericCount++;
          }
        }
      }
      
      // Column is numeric if at least 70% of values are numeric
      if (totalCount > 0 && numericCount / totalCount >= 0.7) {
        const colName = header || `Column ${colIndex + 1}`;
        numericColumns.push(colName);
      }
    });
    
    return numericColumns;
  };

  const numericColumns = getNumericColumns();

  // Bin data for histogram
  const createHistogramData = (columnName: string) => {
    const colIndex = parsedData.headers.findIndex(
      (h, idx) => (h || `Column ${idx + 1}`) === columnName
    );

    if (colIndex === -1) return null;

    // Extract numeric values
    const values: number[] = [];
    parsedData.allData.forEach((row) => {
      const value = row[colIndex];
      if (value) {
        const numValue = parseFloat(value.toString().trim());
        if (!isNaN(numValue) && isFinite(numValue)) {
          values.push(numValue);
        }
      }
    });

    if (values.length === 0) return null;

    // Calculate bins
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    // Handle edge case where all values are the same
    const binWidth = max === min ? 1 : (max - min) / numBins;
    
    // Create bins
    const bins: number[] = new Array(numBins).fill(0);
    const binLabels: string[] = [];

    values.forEach((value) => {
      if (max === min) {
        // All values are the same, put everything in the first bin
        bins[0]++;
      } else {
        let binIndex = Math.floor((value - min) / binWidth);
        // Handle edge case where value equals max
        if (binIndex >= numBins) binIndex = numBins - 1;
        bins[binIndex]++;
      }
    });

    // Create data for nivo with smarter label formatting
    const getPrecision = (value: number) => {
      // Use fewer decimal places for larger values
      if (Math.abs(value) >= 1000) return 0;
      if (Math.abs(value) >= 100) return 1;
      if (Math.abs(value) >= 10) return 2;
      if (Math.abs(value) >= 1) return 2;
      return 3;
    };

    const chartData = bins.map((count, index) => {
      let label: string;
      if (max === min) {
        // All values are the same
        const precision = getPrecision(min);
        label = index === 0 ? `${min.toFixed(precision)}` : `Bin ${index + 1}`;
      } else {
        const binStart = min + index * binWidth;
        const binEnd = min + (index + 1) * binWidth;
        const precision = Math.max(getPrecision(binStart), getPrecision(binEnd));
        
        // Compact format: show range
        label = `[${binStart.toFixed(precision)}, ${binEnd.toFixed(precision)})`;
      }
      binLabels.push(label);
      return {
        bin: label,
        count: count,
        binStart: max === min ? min : min + index * binWidth,
        binEnd: max === min ? min : min + (index + 1) * binWidth,
      };
    });

    return {
      data: chartData,
      min,
      max,
      totalValues: values.length,
    };
  };

  const handleCreateHistogram = () => {
    if (!selectedColumn) return;

    const histogramData = createHistogramData(selectedColumn);
    if (!histogramData) {
      return;
    }

    const chart: ChartData = {
      id: `histogram-${Date.now()}`,
      type: "histogram",
      title: `Histogram: ${selectedColumn}`,
      data: histogramData.data,
      config: {
        column: selectedColumn,
        numBins,
        min: histogramData.min,
        max: histogramData.max,
        totalValues: histogramData.totalValues,
      },
      createdAt: Date.now(),
    };

    onChartCreate(chart);
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">Histogram</h3>
            <p className="text-muted-foreground">
              Create a histogram plot from a numeric column
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">
              Select Column
            </label>
            <Select value={selectedColumn} onValueChange={setSelectedColumn}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a numeric column" />
              </SelectTrigger>
              <SelectContent>
                {numericColumns.length > 0 ? (
                  numericColumns.map((col) => (
                    <SelectItem key={col} value={col}>
                      {col}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    No numeric columns found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Number of Bins
            </label>
            <Select
              value={numBins.toString()}
              onValueChange={(v) => setNumBins(parseInt(v))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 40, 50].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleCreateHistogram}
            disabled={!selectedColumn || numericColumns.length === 0}
          >
            Create Histogram
          </Button>
        </div>

        {numericColumns.length === 0 && (
          <div className="bg-secondary/30 border border-border/50 rounded-lg p-4 text-sm text-muted-foreground">
            No numeric columns found in the dataset. Please upload a file with numeric data.
          </div>
        )}
      </div>
    </Card>
  );
};
