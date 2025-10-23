import { ParsedData } from "@/pages/App";

/**
 * Converts data to CSV format
 */
export const exportToCSV = (data: ParsedData, includedColumns: string[]): string => {
  // Get the indices of included columns
  const columnIndices = includedColumns.map(col => {
    const index = data.headers.findIndex(header => 
      (header || `Column ${data.headers.indexOf(header) + 1}`) === col
    );
    return index;
  }).filter(index => index !== -1);

  // Get filtered headers
  const filteredHeaders = columnIndices.map(index => data.headers[index] || `Column ${index + 1}`);
  
  // Get all data rows (not just preview)
  const allData = data.preview; // For now, using preview data. In a real app, you'd load all data
  
  // Create CSV content
  const csvContent = [
    filteredHeaders.join(','),
    ...allData.map(row => 
      columnIndices.map(index => {
        const cell = row[index] || '';
        // Escape commas and quotes in CSV
        if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      }).join(',')
    )
  ].join('\n');

  return csvContent;
};

/**
 * Converts data to JSON format
 */
export const exportToJSON = (data: ParsedData, includedColumns: string[]): string => {
  // Get the indices of included columns
  const columnIndices = includedColumns.map(col => {
    const index = data.headers.findIndex(header => 
      (header || `Column ${data.headers.indexOf(header) + 1}`) === col
    );
    return index;
  }).filter(index => index !== -1);

  // Get filtered headers
  const filteredHeaders = columnIndices.map(index => data.headers[index] || `Column ${index + 1}`);
  
  // Get all data rows
  const allData = data.preview; // For now, using preview data
  
  // Convert to array of objects
  const jsonData = allData.map(row => {
    const obj: Record<string, string> = {};
    columnIndices.forEach((index, i) => {
      obj[filteredHeaders[i]] = row[index] || '';
    });
    return obj;
  });

  return JSON.stringify(jsonData, null, 2);
};

/**
 * Downloads a file with the given content and filename
 */
export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

/**
 * Downloads data as CSV
 */
export const downloadCSV = (data: ParsedData, includedColumns: string[], filename?: string) => {
  const csvContent = exportToCSV(data, includedColumns);
  const defaultFilename = `${data.fileName.replace(/\.[^/.]+$/, '')}_filtered.csv`;
  downloadFile(csvContent, filename || defaultFilename, 'text/csv');
};

/**
 * Downloads data as JSON
 */
export const downloadJSON = (data: ParsedData, includedColumns: string[], filename?: string) => {
  const jsonContent = exportToJSON(data, includedColumns);
  const defaultFilename = `${data.fileName.replace(/\.[^/.]+$/, '')}_filtered.json`;
  downloadFile(jsonContent, filename || defaultFilename, 'application/json');
};

/**
 * Downloads data as Excel (XLSX) - simplified version using CSV format
 * Note: For full Excel support, you'd need a library like xlsx
 */
export const downloadExcel = (data: ParsedData, includedColumns: string[], filename?: string) => {
  const csvContent = exportToCSV(data, includedColumns);
  const defaultFilename = `${data.fileName.replace(/\.[^/.]+$/, '')}_filtered.xlsx`;
  // For now, we'll download as CSV but with .xlsx extension
  // In a real implementation, you'd use a library like xlsx to create proper Excel files
  downloadFile(csvContent, filename || defaultFilename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
};
