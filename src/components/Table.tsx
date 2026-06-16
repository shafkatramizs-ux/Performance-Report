import React from 'react';
import clsx from 'clsx';
import { isQuarterEnd } from '../utils/dateHelpers';

export interface TableRowProps {
  label: string;
  renderValue: (col: string, val: number | undefined) => React.ReactNode;
  values: Record<string, number>;
}

export interface GenericTableProps {
  title: string;
  columns: string[];
  rows: TableRowProps[];
  showGrowth?: boolean; // If true, expects columns to be [M-12, M-1, M] specifically
  superTitle?: string;
}

export function GenericTable({ title, columns, rows, showGrowth, superTitle }: GenericTableProps) {
  // Determine if we are rendering MoM and YoY headers
  const renderHeaders = () => {
    return (
      <>
        {superTitle && (
          <tr>
            <th className="bg-white border-0"></th>
            <th colSpan={columns.length + (showGrowth ? 2 : 0)} className="bg-[#1e2a5e] text-white p-1 text-center text-xs font-semibold border border-[#1e2a5e] uppercase tracking-wider">
              {superTitle}
            </th>
          </tr>
        )}
        <tr>
          <th className="bg-[#1e2a5e] text-white p-2 text-left text-sm font-semibold border border-[#1e2a5e]">
            {title}
          </th>
          {columns.map((col) => {
            const quarterEnded = isQuarterEnd(col);
            return (
              <th
                key={col}
                className={clsx(
                  "p-2 text-center text-sm font-semibold border",
                  quarterEnded ? "bg-[#EAF0F6] text-[#1e2a5e] border-[#ccd8e5]" : "bg-indigo-50 text-indigo-900 border-indigo-100"
                )}
              >
                {col}
              </th>
            );
          })}
          {showGrowth && (
            <>
              <th className="bg-gray-50 text-gray-800 p-2 text-center text-sm font-semibold border border-gray-200">MoM Growth</th>
              <th className="bg-gray-50 text-gray-800 p-2 text-center text-sm font-semibold border border-gray-200">YoY Growth</th>
            </>
          )}
        </tr>
      </>
    );
  };

  return (
    <div className="overflow-x-auto w-full mb-6">
      <table className="w-full border-collapse bg-white shadow-sm">
        <thead>{renderHeaders()}</thead>
        <tbody>
          {rows.map((row, idx) => {
            let mom: number | undefined;
            let yoy: number | undefined;
            if (showGrowth && columns.length >= 3) {
              const m12 = row.values[columns[0]];
              const m1 = row.values[columns[1]];
              const m = row.values[columns[2]];
              if (m1) mom = (m / m1) - 1;
              if (m12) yoy = (m / m12) - 1;
            }

            return (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="p-2 border border-gray-200 text-sm font-medium text-gray-700 bg-gray-50/50">
                  {row.label}
                </td>
                {columns.map((col) => (
                  <td key={col} className="p-2 border border-gray-200 text-sm text-right text-gray-700">
                    {row.renderValue(col, row.values[col])}
                  </td>
                ))}
                {showGrowth && (
                  <>
                    <td className="p-2 border border-gray-200 text-sm text-right font-medium">
                      <span className={clsx(mom && mom > 0 ? 'text-green-600' : mom && mom < 0 ? 'text-red-600' : 'text-gray-500')}>
                        {mom !== undefined ? new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 }).format(mom) : '-'}
                      </span>
                    </td>
                    <td className="p-2 border border-gray-200 text-sm text-right font-medium">
                      <span className={clsx(yoy && yoy > 0 ? 'text-green-600' : yoy && yoy < 0 ? 'text-red-600' : 'text-gray-500')}>
                        {yoy !== undefined ? new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 }).format(yoy) : '-'}
                      </span>
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
