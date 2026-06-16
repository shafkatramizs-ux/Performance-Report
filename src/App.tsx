import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { UploadCloud } from 'lucide-react';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [rawData, setRawData] = useState<any[]>([]);
  const [allMonths, setAllMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [usdRate, setUsdRate] = useState<number>(3497.5);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert to 2D array, ensuring values are returned as formatted strings (to catch formatted dates properly)
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false, defval: '' }) as any[][];
      
      // Find the header row (the one containing 'datakeyname' or 'Data Key')
      let headerRowIndex = -1;
      for (let i = 0; i < Math.min(jsonData.length, 15); i++) {
        const row = jsonData[i] || [];
        if (row.some(cell => typeof cell === 'string' && (cell.toLowerCase().includes('datakeyname') || cell.toLowerCase().includes('data key')))) {
          headerRowIndex = i;
          break;
        }
      }

      // Fallback: If not found, use the row that has the most text items to guess the header
      if (headerRowIndex === -1) {
          let maxCols = 0;
          for (let i = 0; i < Math.min(jsonData.length, 15); i++) {
              const strCols = (jsonData[i] || []).filter(c => typeof c === 'string' && c.trim() !== '').length;
              if (strCols > maxCols) {
                  maxCols = strCols;
                  headerRowIndex = i;
              }
          }
      }
      
      const headers = jsonData[headerRowIndex] || [];
      
      // Map data to objects using these headers
      const rowData = [];
      for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row || row.length === 0) continue;
        const obj: any = {};
        let hasData = false;
        headers.forEach((header: any, idx: number) => {
          if (header && typeof header === 'string' && header.trim() !== '') {
            obj[header.trim()] = row[idx];
            if (row[idx] !== undefined && row[idx] !== '') hasData = true;
          }
        });
        if (hasData) {
          rowData.push(obj);
        }
      }
      
      // Extract available month columns
      let startIdx = headers.findIndex((k: string) => k && typeof k === 'string' && k.toLowerCase().includes('datakeyname'));
      if (startIdx === -1) {
          startIdx = headers.findIndex((k: string) => k && typeof k === 'string' && k.toLowerCase().includes('data key'));
      }
      if (startIdx === -1) startIdx = 1; // Fallback
      
      const validStartIdx = startIdx + 1;
      
      // Get remaining string headers that look like months (ignoring empty/undefined)
      let months = headers
        .slice(validStartIdx)
        .filter((k: any) => k && typeof k === 'string' && k.trim() !== '')
        .map((k: string) => k.trim());
      
      if (months.length === 0) {
        // Ultimate fallback
        const fallbackMonths = Object.keys(rowData[0] || {}).slice(3);
        if (fallbackMonths.length > 0) {
            months = fallbackMonths;
        } else {
            alert('Could not detect month columns. Please ensure the Excel file follows the expected format with a "datakeyname" column.');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }
      }

      setRawData(rowData);
      setAllMonths(months);
      setSelectedMonth(months[months.length - 1]);
    } catch (error) {
      console.error("Error parsing file:", error);
      alert("Failed to parse the file. Please ensure it is a valid Excel file.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (rawData.length === 0 || allMonths.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans">
        <div className="bg-white p-10 rounded-xl shadow-md border border-gray-100 flex flex-col items-center max-w-md w-full">
          <div className="bg-indigo-100 text-[#294B65] p-4 rounded-full mb-6">
            <UploadCloud size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Performance Report</h2>
          <p className="text-gray-500 text-center text-sm mb-8">
            Upload the standard Excel (.xlsx) file containing the monthly microfinance dataset to automatically generate your performance dashboard.
          </p>
          <label className="cursor-pointer bg-[#294B65] hover:bg-[#294B65]/90 text-white font-medium py-3 px-6 rounded text-sm shadow transition-colors w-full text-center">
            Select Excel File
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".xlsx, .xls, .csv" 
              className="hidden" 
              onChange={handleFileUpload} 
              onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
            />
          </label>
        </div>
      </div>
    );
  }

  return (
    <Dashboard 
      rawData={rawData} 
      allMonths={allMonths} 
      selectedMonth={selectedMonth} 
      usdRate={usdRate}
      onMonthChange={setSelectedMonth}
      onUsdChange={setUsdRate}
    />
  );
}
