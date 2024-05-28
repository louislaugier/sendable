import Papa from 'papaparse';
import { read, utils } from 'xlsx';

// Helper function for CSV files
export const getColumnNamesFromCSV = (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      preview: 1,
      complete: (results: any) => {
        // Filter out any empty strings from the result
        const columns = results.data[0].filter((col: string) => col.trim() !== "");
        resolve(columns as string[]);
      },
      error: (error: any) => {
        reject(error);
      },
    });
  });
};

// Helper function for XLS and XLSX files
export const getColumnNamesFromXLS = (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result as ArrayBuffer);
      const workbook = read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet, { header: 1 });
      resolve(jsonData[0] as string[]);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
};

