export const isQuarterEnd = (monthStr: string) => {
  if (!monthStr) return false;
  return ['mar', 'jun', 'sep', 'dec'].some(q => monthStr.toLowerCase().includes(q));
};

export const getTableColumns = (monthKeys: string[], selectedMonth: string) => {
  const currentIndex = monthKeys.indexOf(selectedMonth);
  if (currentIndex === -1) return [];
  
  const m12 = monthKeys[currentIndex - 12];
  const m2 = monthKeys[currentIndex - 2];
  const m1 = monthKeys[currentIndex - 1];
  const m = selectedMonth;
  return [m12, m2, m1, m].filter(Boolean);
};
