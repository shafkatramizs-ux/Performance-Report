export const formatUSD = (val: number | undefined | null) => {
  if (val === undefined || val === null) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
};

export const formatNumber = (val: number | undefined | null) => {
  if (val === undefined || val === null) return '-';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
};

export const formatPercent = (val: number | undefined | null) => {
  if (val === undefined || val === null) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(val);
};

export const formatGrowth = (current: number, previous: number) => {
  if (!previous) return '-';
  const growth = (current / previous) - 1;
  return formatPercent(growth);
};
