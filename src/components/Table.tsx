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
  compact?: boolean;
}

export function GenericTable({ title, columns, rows, showGrowth, superTitle, compact }: GenericTableProps) {
  // Determine if we are rendering MoM and YoY headers
  const renderHeaders = () => {
    return (
      <>
        {superTitle && (
          <tr>
            <th className="bg-white border-0 p-0 h-1"></th>
            <th colSpan={columns.length + (showGrowth ? 2 : 0)} className={clsx("bg-[#1e2a5e] text-white py-1 px-2 text-center font-semibold border border-[#1e2a5e] uppercase tracking-wider", compact ? "text-[9px] sm:text-[10px]" : "text-[10px] sm:text-xs")}>
              {superTitle}
            </th>
          </tr>
        )}
        <tr>
          <th className={clsx("bg-[#1e2a5e] text-white px-2 text-left font-semibold border border-[#1e2a5e]", compact ? "py-1 text-[11px]" : "py-1.5 text-xs sm:text-sm")}>
            {title}
          </th>
          {columns.map((col) => {
            const quarterEnded = isQuarterEnd(col);
            return (
              <th
                key={col}
                className={clsx(
                  "px-1 text-center font-semibold border",
                  compact ? "py-1 text-[9px] sm:text-[10px]" : "py-1.5 text-[10px] sm:text-xs",
                  quarterEnded ? "bg-[#EAF0F6] text-[#1e2a5e] border-[#ccd8e5]" : "bg-indigo-50 text-indigo-900 border-indigo-100"
                )}
              >
                {col}
              </th>
            );
          })}
          {showGrowth && (
            <>
              <th className={clsx("bg-gray-50 text-gray-800 px-1 text-center font-semibold border border-gray-200", compact ? "py-1 text-[9px] sm:text-[10px]" : "py-1.5 text-[10px] sm:text-xs")}>MoM Growth</th>
              <th className={clsx("bg-gray-50 text-gray-800 px-1 text-center font-semibold border border-gray-200", compact ? "py-1 text-[9px] sm:text-[10px]" : "py-1.5 text-[10px] sm:text-xs")}>YoY Growth</th>
            </>
          )}
        </tr>
      </>
    );
  };

  return (
    <div className="w-full">
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
                <td className={clsx("px-2 border border-gray-200 font-medium text-gray-700 bg-gray-50/50", compact ? "py-1 text-[11px]" : "py-1.5 text-xs sm:text-sm")}>
                  {row.label}
                </td>
                {columns.map((col) => (
                  <td key={col} className={clsx("px-1.5 border border-gray-200 text-right text-gray-700", compact ? "py-1 text-[10px]" : "py-1.5 text-[11px] sm:text-xs")}>
                    {row.renderValue(col, row.values[col])}
                  </td>
                ))}
                {showGrowth && (
                  <>
                    <td className={clsx("px-1.5 border border-gray-200 text-right font-medium", compact ? "py-1 text-[10px]" : "py-1.5 text-[11px] sm:text-xs")}>
                      <span className={clsx(mom && mom > 0 ? 'text-green-600' : mom && mom < 0 ? 'text-red-600' : 'text-gray-500')}>
                        {mom !== undefined ? new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 }).format(mom) : '-'}
                      </span>
                    </td>
                    <td className={clsx("px-1.5 border border-gray-200 text-right font-medium", compact ? "py-1 text-[10px]" : "py-1.5 text-[11px] sm:text-xs")}>
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
