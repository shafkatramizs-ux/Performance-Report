export const isQuarterEnd = (monthStr: string) => {
  if (!monthStr) return false;
  return ['mar', 'jun', 'sep', 'dec'].some(q => monthStr.toLowerCase().includes(q));
};

export const getTable234Columns = (monthKeys: string[], selectedMonth: string) => {
  const currentIndex = monthKeys.indexOf(selectedMonth);
  if (currentIndex === -1) return [];

  const pastQuarterEnds = monthKeys
    .slice(0, currentIndex + 1)
    .filter(isQuarterEnd);

  if (isQuarterEnd(selectedMonth)) {
    return pastQuarterEnds.slice(-5);
  } else {
    // Return previous 4 quarters and the selected month.
    const Qs = pastQuarterEnds.slice(-4);
    const M = selectedMonth;
    return [...Qs, M].filter(Boolean);
  }
};

export const getTable1Columns = (monthKeys: string[], selectedMonth: string) => {
  const currentIndex = monthKeys.indexOf(selectedMonth);
  if (currentIndex === -1) return [];
  
  const m12 = monthKeys[currentIndex - 12];
  const m1 = monthKeys[currentIndex - 1];
  const m = selectedMonth;
  return [m12, m1, m].filter(Boolean);
};
