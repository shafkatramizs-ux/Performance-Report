import React, { useMemo } from 'react';
import { Page1 } from './Page1';
import { Page2 } from './Page2';
import { DashboardData } from '../utils/dashboardData';
import { Printer } from 'lucide-react';

interface DashboardProps {
  rawData: any[];
  allMonths: string[];
  selectedMonth: string;
  usdRate: number;
  onMonthChange: (m: string) => void;
  onUsdChange: (usd: number) => void;
}

export function Dashboard({ rawData, allMonths, selectedMonth, usdRate, onMonthChange, onUsdChange }: DashboardProps) {
  const parsedData = useMemo(() => new DashboardData(rawData, usdRate), [rawData, usdRate]);

  return (
    <div className="min-h-screen bg-gray-100 pb-12 font-sans select-none">
      {/* Control bar - hidden during print */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm print:hidden sticky top-0 z-50">
        <h2 className="text-xl font-semibold text-[#1e2a5e]">Sajida Dashboard Generator</h2>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Reporting Month:</label>
            <select 
              value={selectedMonth} 
              onChange={(e) => onMonthChange(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#1e2a5e]"
            >
              {allMonths.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">UGX to USD Rate:</label>
            <input 
              type="number" 
              value={usdRate} 
              onChange={(e) => onUsdChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm w-24 bg-white focus:outline-none focus:ring-1 focus:ring-[#1e2a5e]"
              step="0.1"
            />
          </div>

          <button 
            onClick={() => window.print()}
            className="flex items-center space-x-2 bg-[#1e2a5e] hover:bg-[#1e2a5e]/90 text-white px-4 py-2 rounded shadow transition-colors text-sm font-medium"
          >
            <Printer size={16} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Pages Container */}
      <div className="pt-8">
        <Page1 data={parsedData} allMonths={allMonths} selectedMonth={selectedMonth} />
        <Page2 data={parsedData} allMonths={allMonths} selectedMonth={selectedMonth} />
      </div>
    </div>
  );
}
