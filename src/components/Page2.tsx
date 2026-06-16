import React from 'react';
import { GenericTable, TableRowProps } from './Table';
import { Visual3, Visual4 } from './Charts';
import { DashboardData } from '../utils/dashboardData';
import { formatNumber, formatPercent, formatUSD } from '../utils/formatters';
import { getTable234Columns } from '../utils/dateHelpers';

export function Page2({ data, allMonths, selectedMonth }: { data: DashboardData, allMonths: string[], selectedMonth: string }) {
  const tableCols = getTable234Columns(allMonths, selectedMonth);

  const t2Rows: TableRowProps[] = [
    { label: 'No. of Branches', renderValue: (_, v) => formatNumber(v), values: {} },
    { label: 'No. of Centers', renderValue: (_, v) => formatNumber(v), values: {} },
    { label: 'No. of FO/SFO/CO/SCO', renderValue: (_, v) => formatNumber(v), values: {} },
    { label: 'Member Admission', renderValue: (_, v) => formatNumber(v), values: {} },
    { label: 'Total Member', renderValue: (_, v) => formatNumber(v), values: {} },
    { label: 'Current Borrowers', renderValue: (_, v) => formatNumber(v), values: {} },
    { label: 'Per FO Total Outstanding', renderValue: (_, v) => formatUSD(v), values: {} },
    { label: 'Per Borrower Loan Outstanding', renderValue: (_, v) => formatUSD(v), values: {} },
  ];

  const t3Rows: TableRowProps[] = [
    { label: 'PAR > 30 (%)', renderValue: (_, v) => formatPercent(v), values: {} },
    { label: 'Amount of Total OD', renderValue: (_, v) => formatUSD(v), values: {} },
    { label: 'Advance / Collection Eff. Ratio', renderValue: (_, v) => formatPercent(v), values: {} },
  ];

  const t4Rows: TableRowProps[] = [
    { label: 'Total Closing Savings', renderValue: (_, v) => formatUSD(v), values: {} },
    { label: 'Savings Per Member', renderValue: (_, v) => formatUSD(v), values: {} },
    { label: 'Saving Balance and POS Ratio', renderValue: (_, v) => formatPercent(v), values: {} },
  ];

  tableCols.forEach(col => {
    t2Rows[0].values[col] = data.getBranches(col);
    t2Rows[1].values[col] = data.getCenters(col);
    t2Rows[2].values[col] = data.getFOs(col);
    t2Rows[3].values[col] = data.getMemberAdmission(col);
    t2Rows[4].values[col] = data.getTotalMember(col);
    t2Rows[5].values[col] = data.getCurrentBorrower(col);
    t2Rows[6].values[col] = data.getPerFOTotalOutstanding(col);
    t2Rows[7].values[col] = data.getPerBorrowerLoanOutstanding(col);

    t3Rows[0].values[col] = data.getPar30(col);
    t3Rows[1].values[col] = data.getAmountOfTotalOD(col);
    t3Rows[2].values[col] = data.getAdvanceCollectionRatio(col);

    t4Rows[0].values[col] = data.getTotalSavingsBalance(col);
    t4Rows[1].values[col] = data.getSavingsPerMember(col);
    t4Rows[2].values[col] = data.getSavingBalancePOSRatio(col);
  });

  const mIndex = allMonths.indexOf(selectedMonth);
  let chartMonths = allMonths.slice(Math.max(0, mIndex - 11), mIndex + 1);
  if (chartMonths.length < 12) {
    const pad = Array(12 - chartMonths.length).fill('');
    chartMonths = [...pad, ...chartMonths];
  }

  const v3Data = chartMonths.map(m => ({
    month: m,
    PAR30: m ? data.getPar30(m) : 0,
  }));

  const v4Data = chartMonths.map(m => ({
    month: m,
    CurrentBorrowers: m ? data.getCurrentBorrower(m) : 0,
    PerBorrowerOS: m ? Math.round(data.getPerBorrowerLoanOutstanding(m)) : 0,
  }));

  return (
    <div className="print-page w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white p-8 sm:p-10 shadow-lg flex flex-col mb-8 print:mb-0 text-gray-900">
       <div className="mb-6 border-b-2 border-[#1e2a5e] pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#1e2a5e] uppercase tracking-wider">Sajida Microfinance</h1>
          <p className="text-gray-500 text-sm mt-1">License No: UMRA03783ND</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-700">Period: {selectedMonth}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Full width stretching table 2 */}
        <GenericTable title="Outreach & Operations" superTitle="Quarter end & latest position" columns={tableCols} rows={t2Rows} />
        
        {/* Two visuals side-by-side underneath */}
        <div className="grid grid-cols-2 gap-6 pb-2 min-h-[300px]">
          <Visual3 data={v3Data} className="w-full h-full flex flex-col bg-white border border-gray-100 shadow-sm p-4 rounded" />
          <Visual4 data={v4Data} className="w-full h-full flex flex-col bg-white border border-gray-100 shadow-sm p-4 rounded" />
        </div>

        {/* Remaining tables stretched */}
        <GenericTable title="Asset Quality & Risk" superTitle="Quarter end & latest position" columns={tableCols} rows={t3Rows} />
        <GenericTable title="Security Deposit Statistics" superTitle="Quarter end & latest position" columns={tableCols} rows={t4Rows} />
      </div>

      <div className="mt-auto pt-6 text-xs text-gray-500 italic">
        *1 USD = {data.getUsdRate()} UGX
      </div>
    </div>
  );
}
