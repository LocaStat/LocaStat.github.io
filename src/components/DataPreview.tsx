import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle2, FileText, Table as TableIcon, Eye } from "lucide-react";
import { ParsedData } from "@/pages/App";
import { useState } from "react";

interface DataPreviewProps {
  data: ParsedData;
  includedColumns: string[];
  excludedColumns: string[];
}

export const DataPreview = ({ data, includedColumns, excludedColumns }: DataPreviewProps) => {
  const [viewMode, setViewMode] = useState<'uploaded' | 'selected'>('uploaded');
  const hasMoreColumns = data.headers.length > 10;
  const hasSelectedColumns = includedColumns.length > 0;
  
  // Get the data to display based on view mode
  const getDisplayData = () => {
    if (viewMode === 'uploaded') {
      return {
        headers: data.headers,
        preview: data.preview,
        columns: data.columns,
        rows: data.rows
      };
    } else {
      // Filter data based on included columns
      const headerIndices = includedColumns.map(col => {
        const index = data.headers.findIndex(header => 
          (header || `Column ${data.headers.indexOf(header) + 1}`) === col
        );
        return index;
      }).filter(index => index !== -1);
      
      const filteredHeaders = headerIndices.map(index => data.headers[index]);
      const filteredPreview = data.preview.map(row => 
        headerIndices.map(index => row[index])
      );
      
      return {
        headers: filteredHeaders,
        preview: filteredPreview,
        columns: filteredHeaders.length,
        rows: data.rows
      };
    }
  };
  
  const displayData = getDisplayData();

  return (
    <div className="space-y-6">
      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-accent/20 p-2 rounded-lg">
            <CheckCircle2 className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">File Ready for Processing</h3>
            <p className="text-sm text-muted-foreground">Your data has been successfully uploaded</p>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-3">{data.fileName}</h4>
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="text-sm">
                <TableIcon className="h-3 w-3 mr-1" />
                {displayData.rows.toLocaleString()} rows
              </Badge>
              <Badge variant="secondary" className="text-sm">
                {displayData.columns} columns
              </Badge>
              {data.sheetName && (
                <Badge variant="outline" className="text-sm">
                  Sheet: {data.sheetName}
                </Badge>
              )}
              {viewMode === 'selected' && (
                <Badge variant="default" className="text-sm">
                  <Eye className="h-3 w-3 mr-1" />
                  Selected View
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Data Table Preview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h4 className="font-semibold">
              Data Preview (Top 5 Rows)
              {viewMode === 'selected' && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  - Selected Columns Only
                </span>
              )}
            </h4>
            
            {/* View Toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <ToggleGroup
                      type="single"
                      value={viewMode}
                      onValueChange={(value) => value && setViewMode(value as 'uploaded' | 'selected')}
                      className="flex items-center border border-border rounded-md"
                    >
                      <ToggleGroupItem
                        value="uploaded"
                        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-r-none border-r border-border"
                        disabled={false}
                      >
                        <FileText className="h-4 w-4" />
                        Uploaded File
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="selected"
                        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-l-none"
                        disabled={!hasSelectedColumns}
                      >
                        <Eye className="h-4 w-4" />
                        Selected Columns
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </TooltipTrigger>
                {!hasSelectedColumns && (
                  <TooltipContent>
                    <p>Select columns in the Column Selection tab to see this preview</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex items-center gap-2">
            {hasMoreColumns && viewMode === 'uploaded' && (
              <Badge variant="outline" className="text-xs">
                Showing first 10 of {data.columns} columns
              </Badge>
            )}
            {viewMode === 'selected' && (
              <Badge variant="default" className="text-xs">
                {displayData.columns} selected columns
              </Badge>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 sticky top-0">
              <tr>
                {displayData.headers.slice(0, 10).map((header, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-3 text-left font-semibold border-b border-border whitespace-nowrap"
                  >
                    {header || `Column ${idx + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayData.preview.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={rowIdx % 2 === 0 ? "bg-background" : "bg-secondary/20"}
                >
                  {row.map((cell, cellIdx) => (
                    <td
                      key={cellIdx}
                      className="px-4 py-3 border-b border-border/50 whitespace-nowrap"
                    >
                      {cell || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {displayData.preview.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {viewMode === 'selected' && includedColumns.length === 0 
              ? "No columns selected for preview" 
              : "No data rows to display"
            }
          </div>
        )}
      </Card>
    </div>
  );
};
