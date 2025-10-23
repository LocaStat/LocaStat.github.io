import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, FileText, Table as TableIcon } from "lucide-react";
import { ParsedData } from "@/pages/App";

interface DataPreviewProps {
  data: ParsedData;
}

export const DataPreview = ({ data }: DataPreviewProps) => {
  const hasMoreColumns = data.headers.length > 10;

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
                {data.rows.toLocaleString()} rows
              </Badge>
              <Badge variant="secondary" className="text-sm">
                {data.columns} columns
              </Badge>
              {data.sheetName && (
                <Badge variant="outline" className="text-sm">
                  Sheet: {data.sheetName}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Data Table Preview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">Data Preview (Top 5 Rows)</h4>
          {hasMoreColumns && (
            <Badge variant="outline" className="text-xs">
              Showing first 10 of {data.columns} columns
            </Badge>
          )}
        </div>
        
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 sticky top-0">
              <tr>
                {data.headers.slice(0, 10).map((header, idx) => (
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
              {data.preview.map((row, rowIdx) => (
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
        
        {data.preview.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No data rows to display
          </div>
        )}
      </Card>
    </div>
  );
};
