import React from 'react';

export interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
}

export function KPICard({ title, value, subtitle }: KPICardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col items-center justify-center text-center h-full">
      <h3 className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
        {title}
      </h3>
      <div className="text-xl font-bold text-[#1e2a5e]">
        {value}
      </div>
      {subtitle && (
        <div className="text-xs text-gray-400 mt-1">
          {subtitle}
        </div>
      )}
    </div>
  );
}
