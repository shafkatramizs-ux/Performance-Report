import React from 'react';
import clsx from 'clsx';
import { isQuarterEnd } from '../utils/dateHelpers';

export interface TableRowProps {
  label: string;
  renderValue: (col: string, val: number | undefined) => React.ReactNode;
  values: Record<string, number>;
  isBold?: boolean;
}

export interface GenericTableProps {
  title: string;
  columns: string[];
  rows: TableRowProps[];
  showGrowth?: boolean;
  showAbsoluteGrowth?: boolean;
  superTitle?: string;
  topHeaderLeft?: string;
  compact?: boolean;
}

export function GenericTable({ title, columns, rows, showGrowth, showAbsoluteGrowth, superTitle, topHeaderLeft, compact }: GenericTableProps) {
  const isAnyGrowth = showGrowth || showAbsoluteGrowth;
  
  // Determine if we are rendering MoM and YoY headers
  const renderHeaders = () => {
    const renderTopRow = () => {
      if (!superTitle && !topHeaderLeft) return null;

      if (topHeaderLeft) {
        return (
          <tr>
            <th className={clsx("bg-[#294B65] text-white py-1 px-2 text-left font-semibold border border-[#294B65] tracking-wider", compact ? "text-xs sm:text-sm" : "text-xs sm:text-sm")}>
              {topHeaderLeft}
            </th>
            <th colSpan={columns.length + (isAnyGrowth ? 2 : 0)} className={clsx("bg-[#294B65] text-white py-1 px-2 text-center font-semibold border border-[#294B65] uppercase tracking-wider", compact ? "text-[10px] sm:text-xs" : "text-[10px] sm:text-xs")}>
              {superTitle}
            </th>
          </tr>
        );
      } else if (superTitle) {
        return (
          <tr>
            <th colSpan={columns.length + 1 + (isAnyGrowth ? 2 : 0)} className={clsx("bg-[#294B65] text-white py-1 px-2 text-left font-semibold border border-[#294B65] uppercase tracking-wider", compact ? "text-[10px] sm:text-xs" : "text-[10px] sm:text-xs")}>
              {superTitle}
            </th>
          </tr>
        );
      }
      return null;
    };

    return (
      <>
        {renderTopRow()}
        <tr>
          <th className={clsx("bg-[#3CA371] text-white px-2 text-left font-semibold border border-[#3CA371]", compact ? "py-0.5 text-xs sm:text-sm" : "py-1.5 text-xs sm:text-sm")}>
            {title}
          </th>
          {columns.map((col) => {
            const quarterEnded = isQuarterEnd(col);
            return (
              <th
                key={col}
                className={clsx(
                  "px-1 text-center font-semibold border text-white",
                  compact ? "py-0.5 text-[10px] sm:text-xs" : "py-1.5 text-[10px] sm:text-xs",
                  quarterEnded ? "bg-[#359B67] border-[#3CA371]" : "bg-[#3CA371] border-[#3CA371]"
                )}
              >
                {col}
              </th>
            );
          })}
          {isAnyGrowth && (
            <>
              <th className={clsx("bg-[#3CA371] text-white px-1 text-center font-semibold border border-[#3CA371]", compact ? "py-0.5 text-[10px] sm:text-xs" : "py-1.5 text-[10px] sm:text-xs")}>{showAbsoluteGrowth ? "MoM Change" : "MoM Growth"}</th>
              <th className={clsx("bg-[#3CA371] text-white px-1 text-center font-semibold border border-[#3CA371]", compact ? "py-0.5 text-[10px] sm:text-xs" : "py-1.5 text-[10px] sm:text-xs")}>{showAbsoluteGrowth ? "YoY Change" : "YoY Growth"}</th>
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
            
            if (isAnyGrowth && columns.length >= 2) {
              const m12 = row.values[columns[0]];
              const m1 = row.values[columns[columns.length - 2]];
              const m = row.values[columns[columns.length - 1]];
              
              if (showAbsoluteGrowth) {
                if (m !== undefined && m1 !== undefined) mom = m - m1;
                if (m !== undefined && m12 !== undefined) yoy = m - m12;
              } else {
                if (m !== undefined && m1 !== undefined && m1 !== 0) mom = (m / m1) - 1;
                if (m !== undefined && m12 !== undefined && m12 !== 0) yoy = (m / m12) - 1;
              }
            }

            const getSignColor = (val: number | undefined, label: string) => {
              if (val === undefined || Math.abs(val) < 0.0001) return 'text-gray-500';
              const labelLower = label.toLowerCase();
              const isInverted = labelLower.includes('par') || labelLower.includes('od');
              if (isInverted) {
                return val > 0 ? 'text-red-600' : 'text-green-600';
              }
              return val > 0 ? 'text-green-600' : 'text-red-600';
            };

            const renderDiff = (val: number | undefined, label: string) => {
              if (val === undefined) return '-';
              const absVal = Math.abs(val);
              const formatted = showAbsoluteGrowth ? row.renderValue('growth', absVal) : new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 }).format(absVal);
              if (absVal < 0.0001) {
                return formatted;
              }
              const sign = val > 0 ? '+' : '-';
              const ticker = val > 0 ? ' ▲' : ' ▼';
              return sign + formatted + ticker;
            };

            return (
              <tr key={idx} className={clsx("hover:bg-gray-50", row.isBold ? "font-bold bg-indigo-50/30" : "")}>
                <td className={clsx("px-2 border border-gray-200 text-gray-700 bg-gray-50/50", compact ? "py-0.5 text-xs sm:text-sm" : "py-1.5 text-xs sm:text-sm", row.isBold ? "font-bold" : "font-medium")}>
                  {row.label}
                </td>
                {columns.map((col) => (
                  <td key={col} className={clsx("px-1.5 border border-gray-200 text-right text-gray-700", compact ? "py-0.5 text-[11px] sm:text-xs" : "py-1.5 text-[11px] sm:text-xs", row.isBold ? "font-bold" : "")}>
                    {row.renderValue(col, row.values[col])}
                  </td>
                ))}
                {isAnyGrowth && (
                  <>
                    <td className={clsx("px-1.5 border border-gray-200 text-right font-medium", compact ? "py-0.5 text-[11px] sm:text-xs" : "py-1.5 text-[11px] sm:text-xs")}>
                      <span className={clsx(getSignColor(mom, row.label), "whitespace-nowrap")}>
                        {renderDiff(mom, row.label)}
                      </span>
                    </td>
                    <td className={clsx("px-1.5 border border-gray-200 text-right font-medium", compact ? "py-0.5 text-[11px] sm:text-xs" : "py-1.5 text-[11px] sm:text-xs")}>
                      <span className={clsx(getSignColor(yoy, row.label), "whitespace-nowrap")}>
                        {renderDiff(yoy, row.label)}
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
