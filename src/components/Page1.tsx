import React from 'react';
import { KPICard } from './KPICard';
import { GenericTable, TableRowProps } from './Table';
import { Visual1, Visual2 } from './Charts';
import { DashboardData } from '../utils/dashboardData';
import { formatUSD, formatNumber, formatPercent } from '../utils/formatters';
import { getTableColumns } from '../utils/dateHelpers';

export function Page1({ data, allMonths, selectedMonth }: { data: DashboardData, allMonths: string[], selectedMonth: string }) {
  const table1Cols = getTableColumns(allMonths, selectedMonth);

  // KPIs
  const currentTotalOs = data.getTotalOutstandingUSD(selectedMonth);
  const currentPar30 = data.getPar30(selectedMonth);
  const currentBorrower = data.getCurrentBorrower(selectedMonth);
  const cumulativeDisb = data.getCumulativeDisbursementUSD(selectedMonth);

  const t1Rows: TableRowProps[] = [
    { label: 'No. of Loan Disbursed', renderValue: (_, v) => formatNumber(v), values: {} },
    { label: 'No. of repeat loan disbursed', renderValue: (_, v) => formatNumber(v), values: {} },
    { label: 'Total Loan Disbursed (number)', renderValue: (_, v) => formatNumber(v), values: {}, isBold: true },
    { label: 'New Loan Disbursed (USD)', renderValue: (_, v) => formatUSD(v), values: {} },
    { label: 'Repeat loan disbursed (USD)', renderValue: (_, v) => formatUSD(v), values: {} },
    { label: 'Total loan disbursed (USD)', renderValue: (_, v) => formatUSD(v), values: {}, isBold: true },
    { label: 'SML Outstanding (USD)', renderValue: (_, v) => formatUSD(v), values: {} },
    { label: 'SEL Outstanding (USD)', renderValue: (_, v) => formatUSD(v), values: {} },
    { label: 'Total Outstanding (USD)', renderValue: (_, v) => formatUSD(v), values: {}, isBold: true },
  ];

  table1Cols.forEach(col => {
    t1Rows[0].values[col] = data.getNewLoanNumber(col);
    t1Rows[1].values[col] = data.getRepeatLoanNumber(col);
    t1Rows[2].values[col] = data.getTotalLoanDisbursedNumber(col);
    t1Rows[3].values[col] = data.getNewLoanDisbursedUSD(col);
    t1Rows[4].values[col] = data.getRepeatLoanDisbursedUSD(col);
    t1Rows[5].values[col] = data.getTotalLoanDisbursedUSD(col);
    t1Rows[6].values[col] = data.getSmlOutstandingUSD(col);
    t1Rows[7].values[col] = data.getSelOutstandingUSD(col);
    t1Rows[8].values[col] = data.getTotalOutstandingUSD(col);
  });

  // Calculate 12m for charts
  const mIndex = allMonths.indexOf(selectedMonth);
  let chartMonths = allMonths.slice(Math.max(0, mIndex - 11), mIndex + 1);
  if (chartMonths.length < 12) {
    const pad = Array(12 - chartMonths.length).fill('');
    chartMonths = [...pad, ...chartMonths];
  }

  const v1Data = chartMonths.map((m, i) => {
    if (!m) return { month: '', SML: 0, SEL: 0 };
    const sml = data.getSmlOutstandingUSD(m);
    const sel = data.getSelOutstandingUSD(m);
    const total = sml + sel;
    return {
      month: m,
      SML: total ? sml / total : 0,
      SEL: total ? sel / total : 0,
    };
  });

  const v2Data = chartMonths.map(m => {
    if (!m) return { month: '', AvgNew: 0, AvgRepeat: 0 };
    return {
      month: m,
      AvgNew: data.getAverageLoanSizeNew(m),
      AvgRepeat: data.getAverageLoanSizeRepeat(m),
    };
  });


  return (
    <div className="print-page w-[210mm] h-[297mm] max-w-full sm:mx-auto bg-white p-6 sm:p-10 shadow-lg flex flex-col mb-8 print:mb-0 text-gray-900 border border-gray-100 box-border overflow-hidden">
      <div className="flex-none mb-4 border-b-2 border-[#294B65] pb-2 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#294B65] uppercase tracking-wider leading-tight">SAJIDA MICROFINANCE LIMITED</h1>
          <p className="text-gray-500 text-xs mt-0.5">License No: UMRA03783ND</p>
          <p className="text-gray-500 text-xs">Performance Report</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-700 text-sm">Period: {selectedMonth}</p>
        </div>
      </div>

      <div className="flex-none grid grid-cols-4 gap-4 mb-6">
        <KPICard title="Total Outstanding" value={formatUSD(currentTotalOs)} />
        <KPICard title="PAR > 30 Days" value={formatPercent(currentPar30)} />
        <KPICard title="Current Borrowers" value={formatNumber(currentBorrower)} />
        <KPICard title="Cumulative Disb." value={formatUSD(cumulativeDisb)} />
      </div>

      <div className="flex-none mb-4">
        <GenericTable title="Particulars" superTitle="Disbursement & Outstanding (Month End & Growth Statistics)" columns={table1Cols} rows={t1Rows} showGrowth={true} />
      </div>

      <div className="flex-1 flex flex-col min-h-0 pb-2">
        <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
          <Visual1 data={v1Data} className="w-full h-full flex flex-col bg-white border border-gray-100 shadow-sm p-3 rounded" />
          <Visual2 data={v2Data} className="w-full h-full flex flex-col bg-white border border-gray-100 shadow-sm p-3 rounded relative" />
        </div>
      </div>
      
      <div className="flex-none mt-4 text-[10px] text-gray-500 italic">
        *1 USD = {data.getUsdRate()} UGX
      </div>
    </div>
  );
}
