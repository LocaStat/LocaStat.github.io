import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, Table as TableIcon, Eye, X } from "lucide-react";

interface FileMetadataCardProps {
  fileName: string;
  rows: number;
  columns: number;
  sheetName?: string;
  viewMode?: 'uploaded' | 'selected';
  onClearClick: () => void;
}

export const FileMetadataCard = ({
  fileName,
  rows,
  columns,
  sheetName,
  viewMode = 'uploaded',
  onClearClick,
}: FileMetadataCardProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="bg-primary/10 p-3 rounded-lg">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-3">{fileName}</h4>
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="text-sm">
                <TableIcon className="h-3 w-3 mr-1" />
                {rows.toLocaleString()} rows
              </Badge>
              <Badge variant="secondary" className="text-sm">
                {columns} columns
              </Badge>
              {sheetName && (
                <Badge variant="outline" className="text-sm">
                  Sheet: {sheetName}
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
        
        {/* Status Badge and Clear Button */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-accent/20 p-2 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-accent" />
            </div>
            <div className="text-right">
              <h3 className="font-semibold text-lg">File Ready for Processing</h3>
              <p className="text-sm text-muted-foreground">Your data has been successfully uploaded</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearClick}
            className="flex items-center gap-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
          >
            <X className="h-4 w-4" />
            Clear Data
          </Button>
        </div>
      </div>
    </Card>
  );
};

