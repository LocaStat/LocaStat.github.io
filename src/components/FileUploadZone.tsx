import { useState, useRef } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { ParsedData } from "@/pages/App";
import { SheetSelector } from "./SheetSelector";
import { toast } from "sonner";

interface FileUploadZoneProps {
  onFileUpload: (data: ParsedData) => void;
}

export const FileUploadZone = ({ onFileUpload }: FileUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [excelData, setExcelData] = useState<{
    workbook: XLSX.WorkBook;
    fileName: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleFile = (file: File) => {
    setError(null);
    
    // Validate file size
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10 MB limit. Please upload a smaller file.");
      toast.error("File too large");
      return;
    }

    // Validate file type
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !["csv", "xlsx"].includes(extension)) {
      setError("Only CSV and XLSX files are supported.");
      toast.error("Invalid file type");
      return;
    }

    setIsProcessing(true);

    if (extension === "csv") {
      parseCSV(file);
    } else {
      parseExcel(file);
    }
  };

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      complete: (results) => {
        try {
          const data = results.data as string[][];
          
          if (!data || data.length === 0) {
            setError("File appears to be empty. Please upload a file with data.");
            setIsProcessing(false);
            return;
          }

          const headers = data[0];
          const preview = data.slice(1, 6); // Top 5 rows
          const rows = data.length - 1;
          const columns = headers.length;

          const parsedData: ParsedData = {
            fileName: file.name,
            rows,
            columns,
            headers,
            preview: preview.map(row => row.slice(0, 10)), // First 10 columns
          };

          // Store in sessionStorage
          sessionStorage.setItem("parsedData", JSON.stringify(parsedData));
          onFileUpload(parsedData);
          setIsProcessing(false);
        } catch (err) {
          setError("Error reading file. Please check file format and try again.");
          setIsProcessing(false);
          toast.error("Parse error");
        }
      },
      error: () => {
        setError("Error reading file. Please check file format and try again.");
        setIsProcessing(false);
        toast.error("Parse error");
      },
    });
  };

  const parseExcel = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        
        if (workbook.SheetNames.length === 0) {
          setError("Excel file contains no sheets.");
          setIsProcessing(false);
          return;
        }

        // If multiple sheets, show selector
        if (workbook.SheetNames.length > 1) {
          setExcelData({ workbook, fileName: file.name });
          setIsProcessing(false);
        } else {
          // Single sheet, process directly
          processExcelSheet(workbook, workbook.SheetNames[0], file.name);
        }
      } catch (err) {
        setError("Unable to read Excel file. Please ensure file is valid.");
        setIsProcessing(false);
        toast.error("Parse error");
      }
    };

    reader.onerror = () => {
      setError("Unable to read Excel file. Please ensure file is valid.");
      setIsProcessing(false);
      toast.error("File read error");
    };

    reader.readAsBinaryString(file);
  };

  const processExcelSheet = (workbook: XLSX.WorkBook, sheetName: string, fileName: string) => {
    try {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

      if (!jsonData || jsonData.length === 0) {
        setError("Selected sheet appears to be empty.");
        return;
      }

      const headers = jsonData[0].map(h => String(h || ""));
      const preview = jsonData.slice(1, 6);
      const rows = jsonData.length - 1;
      const columns = headers.length;

      const parsedData: ParsedData = {
        fileName,
        rows,
        columns,
        headers,
        preview: preview.map(row => row.slice(0, 10).map(cell => String(cell || ""))),
        sheetName,
      };

      sessionStorage.setItem("parsedData", JSON.stringify(parsedData));
      onFileUpload(parsedData);
      setExcelData(null);
      setIsProcessing(false);
    } catch (err) {
      setError("Error processing Excel sheet. Please try again.");
      setIsProcessing(false);
      toast.error("Processing error");
    }
  };

  const handleSheetSelect = (sheetName: string) => {
    if (excelData) {
      setIsProcessing(true);
      processExcelSheet(excelData.workbook, sheetName, excelData.fileName);
    }
  };

  return (
    <>
      <Card
        className={`relative overflow-hidden transition-all duration-300 ${
          isDragging
            ? "border-primary bg-primary/5 shadow-lg scale-[1.02]"
            : "border-border hover:border-primary/50 hover:shadow-md"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-12 text-center">
          <div
            className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-all ${
              isDragging ? "bg-primary/20 scale-110" : "bg-primary/10"
            }`}
          >
            {isProcessing ? (
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            ) : (
              <Upload className="h-8 w-8 text-primary" />
            )}
          </div>
          
          <h3 className="text-xl font-semibold mb-2">
            {isProcessing ? "Processing file..." : "Upload Your Data File"}
          </h3>
          
          <p className="text-muted-foreground mb-6">
            Drag and drop your file here, or click to browse
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileSelect}
            className="hidden"
          />

          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            size="lg"
            className="mb-6"
          >
            <FileText className="mr-2 h-5 w-5" />
            Select File
          </Button>

          <div className="text-sm text-muted-foreground">
            <p>Supported formats: CSV, XLSX</p>
            <p className="mt-1">Maximum size: 10 MB</p>
          </div>
        </div>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {excelData && (
        <SheetSelector
          sheets={excelData.workbook.SheetNames}
          onSelect={handleSheetSelect}
          onCancel={() => {
            setExcelData(null);
            setIsProcessing(false);
          }}
        />
      )}
    </>
  );
};
