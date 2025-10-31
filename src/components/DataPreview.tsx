import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
import { FileText, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { ParsedData } from "@/pages/App";
import { useState, useEffect } from "react";
import { FileMetadataCard } from "@/components/FileMetadataCard";

interface DataPreviewProps {
  data: ParsedData;
  includedColumns: string[];
  excludedColumns: string[];
  onClearData: () => void;
  isCollapsed?: boolean;
}

export const DataPreview = ({ data, includedColumns, excludedColumns, onClearData, isCollapsed = false }: DataPreviewProps) => {
  const [viewMode, setViewMode] = useState<'uploaded' | 'selected'>('uploaded');
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [open, setOpen] = useState(!isCollapsed);
  const hasMoreColumns = data.headers.length > 50;
  const hasSelectedColumns = includedColumns.length > 0;

  // Update open state when isCollapsed prop changes
  useEffect(() => {
    setOpen(!isCollapsed);
  }, [isCollapsed]);
  
  const handleClearClick = () => {
    setShowClearDialog(true);
  };

  const handleConfirmClear = () => {
    setShowClearDialog(false);
    onClearData();
  };
  
  // Get the data to display based on view mode
  const getDisplayData = () => {
    if (viewMode === 'uploaded') {
      // Limit to first 50 columns for uploaded view
      const maxColumns = Math.min(50, data.headers.length);
      return {
        headers: data.headers.slice(0, maxColumns),
        preview: data.preview.map(row => row.slice(0, maxColumns)),
        columns: data.columns,
        rows: data.rows
      };
    } else {
      // Filter data based on included columns, limit to 50 maximum
      const headerIndices = includedColumns.map(col => {
        const index = data.headers.findIndex(header => 
          (header || `Column ${data.headers.indexOf(header) + 1}`) === col
        );
        return index;
      }).filter(index => index !== -1);
      
      const maxColumns = Math.min(50, headerIndices.length);
      const filteredHeaders = headerIndices.slice(0, maxColumns).map(index => data.headers[index]);
      const filteredPreview = data.preview.map(row => 
        headerIndices.slice(0, maxColumns).map(index => row[index])
      );
      
      return {
        headers: filteredHeaders,
        preview: filteredPreview,
        columns: includedColumns.length, // Show total selected, not limited
        rows: data.rows
      };
    }
  };
  
  const displayData = getDisplayData();

  return (
    <div className="space-y-6">
      {/* Metadata */}
      <FileMetadataCard
        fileName={data.fileName}
        rows={displayData.rows}
        columns={displayData.columns}
        sheetName={data.sheetName}
        viewMode={viewMode}
        onClearClick={handleClearClick}
      />

      {/* Data Table Preview */}
      <Collapsible open={open} onOpenChange={setOpen}>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
              <div className="flex-col items-center gap-2">
                <h4 className="font-semibold">
                  Data Preview (Top 5 Rows)
                </h4>
                {viewMode === 'selected' && (
                <span className="text-sm font-normal text-muted-foreground">
                  Selected Columns Only
                </span>
              )}
              </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-primary hover:text-primary-foreground group">
                    {open ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-primary-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary-foreground" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>

            </div>
            
            {/* Badges - always visible */}
            <div className="flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
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

            <div className="flex justify-center items-center gap-2">
              {hasMoreColumns && viewMode === 'uploaded' && (
                <Badge variant="outline" className="text-xs">
                  Showing first 50 of {data.columns} columns
                </Badge>
              )}
              {viewMode === 'selected' && (
                <>
                  <Badge variant="default" className="text-xs">
                    {displayData.columns} selected columns
                  </Badge>
                  {includedColumns.length > 50 && (
                    <Badge variant="outline" className="text-xs">
                      Showing first 50 of {includedColumns.length} selected
                    </Badge>
                  )}
                </>
              )}
            </div>
            </div>
                          {/* View Toggle - always visible */}

          </div>
          
          <CollapsibleContent>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 sticky top-0">
                  <tr>
                    {displayData.headers.map((header, idx) => (
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
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Clear Data Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Data</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to clear all uploaded data? This action cannot be undone and will remove:
              <ul className="mt-2 space-y-1 text-sm">
                <li>• The uploaded file ({data.fileName})</li>
                <li>• All data previews and processing</li>
                <li>• Any column selections you've made</li>
                <li>• All analysis results and exports</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmClear}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
