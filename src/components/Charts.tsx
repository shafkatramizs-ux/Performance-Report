import React from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, LabelList
} from 'recharts';

// Helper to filter to specific months for labeling (0, 3, 6, 9, 11) for exactly 12 months of data
const shouldLabel = (index: number) => [0, 3, 6, 9, 11].includes(index);

const CustomXAxisTick = (props: any) => {
  const { x, y, payload, index } = props;
  if (!shouldLabel(index)) return null;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize={11}>
        {payload.value}
      </text>
    </g>
  );
};

const CustomDataLabel = (props: any) => {
  const { x, y, width, height, value, index, formatter, stacked, offset = -4, position, dx = 0, dy = 0 } = props;
  if (!shouldLabel(index)) return null;
  const val = typeof value === 'number' && formatter ? formatter(value) : value;
  if (val === undefined || val === null || val === 0 || val === '0%' || val === '$0k') return null; // Avoid overlapping 0s

  const posX = width !== undefined ? x + width / 2 + dx : x + dx;
  let posY = y + dy;
  
  if (stacked) {
    if (height !== undefined) {
      posY = y + height / 2;
    } else {
      posY = y + 16;
    }
  } else if (position === 'bottom') {
    posY = y + Math.abs(offset) + 12;
  } else if (position === 'insideTop') {
    posY = y + 12;
  } else {
    posY = y + offset;
  }

  return (
    <text 
      x={posX} 
      y={posY} 
      fill={stacked ? "#fff" : "#111827"} 
      fontSize={9} 
      fontWeight={600}
      textAnchor="middle"
      stroke={stacked ? "none" : "#ffffff"}
      strokeWidth={2}
      paintOrder="stroke"
    >
      {val}
    </text>
  );
};

export const Visual1 = ({ data, className }: { data: any[], className?: string }) => {
  return (
    <div className={className || "h-72 w-full bg-white border border-gray-100 shadow-sm p-4 rounded flex flex-col"}>
      <h3 className="text-sm font-semibold text-center mb-4 text-[#1e2a5e]">Portfolio Composition</h3>
      <div className="flex-grow min-h-0 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} stackOffset="expand" margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
            <XAxis dataKey="month" tick={<CustomXAxisTick />} tickLine={false} />
            <YAxis tickFormatter={(val) => `${(val * 100).toFixed(0)}%`} tick={{fontSize: 11}} tickLine={false} axisLine={false} />
            <Tooltip formatter={(val: number) => `${(val * 100).toFixed(1)}%`} />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Bar dataKey="SML" stackId="a" fill="#1e2a5e" name="Microcredit (SML)">
              <LabelList dataKey="SML" content={<CustomDataLabel stacked formatter={(v: number) => `${(v * 100).toFixed(0)}%`} />} />
            </Bar>
            <Bar dataKey="SEL" stackId="a" fill="#3b82f6" name="Microenterprise (SEL)">
              <LabelList dataKey="SEL" content={<CustomDataLabel stacked formatter={(v: number) => `${(v * 100).toFixed(0)}%`} />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const Visual2 = ({ data, className }: { data: any[], className?: string }) => {
  const [chartType, setChartType] = React.useState('bar');

  return (
    <div className={className || "h-72 w-full bg-white border border-gray-100 shadow-sm p-4 rounded flex flex-col relative"}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[13px] font-semibold text-[#1e2a5e]">Average loan size comparison (New vs Repeat)</h3>
        <select 
          value={chartType} 
          onChange={(e) => setChartType(e.target.value)}
          className="text-[10px] border border-gray-200 rounded px-1 py-1 text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#1e2a5e]"
        >
          <option value="bar">Bar Chart</option>
          <option value="line">Trend Graph</option>
        </select>
      </div>
      <div className="flex-grow min-h-0 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={data} margin={{ top: 20, right: 40, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="month" tick={<CustomXAxisTick />} tickLine={false} />
              <YAxis tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`} tick={{fontSize: 10}} tickLine={false} axisLine={false} />
              <Tooltip formatter={(val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits:0}).format(val)} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Bar dataKey="AvgNew" fill="#1e2a5e" name="Avg Loan Size (New)">
                 <LabelList dataKey="AvgNew" content={<CustomDataLabel offset={-16} formatter={(v: number) => `$${(v/1000).toFixed(1)}k`} />} />
              </Bar>
              <Bar dataKey="AvgRepeat" fill="#60a5fa" name="Avg Loan Size (Repeat)">
                 <LabelList dataKey="AvgRepeat" content={<CustomDataLabel offset={-8} formatter={(v: number) => `$${(v/1000).toFixed(1)}k`} />} />
              </Bar>
            </BarChart>
          ) : (
            <LineChart data={data} margin={{ top: 20, right: 40, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="month" tick={<CustomXAxisTick />} tickLine={false} />
              <YAxis tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`} tick={{fontSize: 10}} tickLine={false} axisLine={false} />
              <Tooltip formatter={(val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits:0}).format(val)} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Line type="monotone" dataKey="AvgNew" stroke="#1e2a5e" strokeWidth={2} dot={{ r: 3 }} name="Avg Loan Size (New)">
                 <LabelList dataKey="AvgNew" content={<CustomDataLabel offset={-12} formatter={(v: number) => `$${(v/1000).toFixed(1)}k`} />} />
              </Line>
              <Line type="monotone" dataKey="AvgRepeat" stroke="#60a5fa" strokeWidth={2} dot={{ r: 3 }} name="Avg Loan Size (Repeat)">
                 <LabelList dataKey="AvgRepeat" content={<CustomDataLabel position="bottom" offset={10} formatter={(v: number) => `$${(v/1000).toFixed(1)}k`} />} />
              </Line>
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const Visual3 = ({ data, className }: { data: any[], className?: string }) => {
  return (
    <div className={className || "h-72 w-full bg-white border border-gray-100 shadow-sm p-4 rounded flex flex-col"}>
      <h3 className="text-[13px] font-semibold text-center mb-2 text-[#1e2a5e]">Risk Trend: PAR &gt; 30</h3>
      <div className="flex-grow min-h-0 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 40, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
            <XAxis dataKey="month" tick={<CustomXAxisTick />} tickLine={false} />
            <YAxis tickFormatter={(val) => `${(val * 100).toFixed(1)}%`} tick={{fontSize: 10}} tickLine={false} axisLine={false} />
            <Tooltip formatter={(val: number) => `${(val * 100).toFixed(2)}%`} />
            <Line type="monotone" dataKey="PAR30" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="PAR>30">
              <LabelList dataKey="PAR30" content={<CustomDataLabel offset={-12} formatter={(v: number) => `${(v * 100).toFixed(1)}%`} />} />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const Visual4 = ({ data, className }: { data: any[], className?: string }) => {
  return (
    <div className={className || "h-72 w-full bg-white border border-gray-100 shadow-sm p-4 rounded flex flex-col"}>
      <h3 className="text-[13px] font-semibold text-center mb-2 text-[#1e2a5e]">Current Borrowers vs Per Borrowers OS</h3>
      <div className="flex-grow min-h-0 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 40, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
            <XAxis dataKey="month" tick={<CustomXAxisTick />} tickLine={false} />
            <YAxis yAxisId="left" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `$${v}`} tick={{fontSize: 10}} tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            <Bar yAxisId="left" dataKey="CurrentBorrowers" fill="#94a3b8" name="Current Borrowers" opacity={0.5}>
              <LabelList dataKey="CurrentBorrowers" content={<CustomDataLabel position="insideTop" dy={8} formatter={(v: number) => v > 1000 ? `${(v/1000).toFixed(1)}k` : v} />} />
            </Bar>
            <Line yAxisId="right" type="monotone" dataKey="PerBorrowerOS" stroke="#1e2a5e" strokeWidth={2} dot={{r:2}} name="Per Borrower OS">
              <LabelList dataKey="PerBorrowerOS" content={<CustomDataLabel position="top" offset={10} formatter={(v: number) => `$${v}`} />} />
            </Line>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
