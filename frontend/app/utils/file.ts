import Papa from 'papaparse';
import XLSX from 'xlsx';

// Helper function for CSV files
export const getColumnNamesFromCSV = (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      preview: 1,
      complete: (results: any) => {
        resolve(results.data[0] as string[]);
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
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      resolve(jsonData[0] as string[]);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
};

