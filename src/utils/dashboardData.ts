export class DashboardData {
  constructor(private rawData: any[], private usdRate: number) {}

  getUsdRate() { return this.usdRate; }

  // Helper to find value regardless of case/spacing in keys
  private getCaseInsensitiveProp(obj: any, propName: string) {
    if (!obj) return '';
    const key = Object.keys(obj).find(k => k.toLowerCase().replace(/\s/g, '') === propName.toLowerCase().replace(/\s/g, ''));
    return key ? obj[key] : '';
  }

  getRawValue(dataKey: string, datakeyname: string, month: string) {
    const row = this.rawData.find((r) => {
      const rDataKey = this.getCaseInsensitiveProp(r, 'Data Key');
      const rDataKeyName = this.getCaseInsensitiveProp(r, 'datakeyname');
      return (
        (rDataKey || '').trim().toLowerCase() === dataKey.trim().toLowerCase() &&
        (rDataKeyName || '').trim().toLowerCase() === datakeyname.trim().toLowerCase()
      );
    });
    if (!row) return 0;
    
    // The month column might also have slightly different formatting in excel
    // If exact match fails, try case-insensitive trimming
    let val = row[month];
    if (val === undefined || val === null) {
      const matchedKey = Object.keys(row).find(k => k.trim().toLowerCase() === month.trim().toLowerCase());
      if (matchedKey) val = row[matchedKey];
    }
    
    if (val === undefined || val === null) return 0;
    if (typeof val === 'number') return val;
    val = val.toString().trim();
    if (val === '-' || val === '') return 0;
    val = val.replace(/,/g, '').replace(/%/g, '');
    return parseFloat(val) || 0;
  }

  // Table 1
  getNewLoanNumber(month: string) { return this.getRawValue('Total', 'No. of Loan Disbursed(New)', month); }
  getTotalLoanDisbursedNumber(month: string) { return this.getRawValue('Total', 'No. of Loan Disbursed (Total)', month); }
  getRepeatLoanNumber(month: string) { return this.getTotalLoanDisbursedNumber(month) - this.getNewLoanNumber(month); }
  
  getNewLoanDisbursedUSD(month: string) { return this.getRawValue('Total', 'Amount of Loan Disbursed(New)', month) / this.usdRate; }
  getTotalLoanDisbursedUSD(month: string) { return this.getRawValue('Total', 'Amount of Loan Disbursed (Total)', month) / this.usdRate; }
  getRepeatLoanDisbursedUSD(month: string) { return this.getTotalLoanDisbursedUSD(month) - this.getNewLoanDisbursedUSD(month); }
  
  getSmlOutstandingUSD(month: string) { return this.getRawValue('Group', 'Total Outstanding', month) / this.usdRate; }
  getSelOutstandingUSD(month: string) { return this.getRawValue('Enterprise', 'Total Outstanding', month) / this.usdRate; }
  getTotalOutstandingUSD(month: string) { return this.getRawValue('Total', 'Total Outstanding', month) / this.usdRate; }
  
  // KPIs
  getPar30(month: string) { return this.getRawValue('Total', 'PAR>30(%)', month) / 100; }
  getCurrentBorrower(month: string) { return this.getRawValue('Total', 'Current Borrowers', month); }
  getCumulativeDisbursementUSD(month: string) { return this.getRawValue('Total', 'Amount of Loan Disbursed (Year to Date)', month) / this.usdRate; }

  // Table 2
  getBranches(month: string) { return this.getRawValue('Total', 'No. of Branches', month); }
  getCenters(month: string) { return this.getRawValue('Total', 'No. of Centers', month); }
  getFOs(month: string) { return this.getRawValue('Total', 'No. of FO/SFO/CO/SCO', month); }
  getMemberAdmission(month: string) { return this.getRawValue('Total', 'Member Admission', month); }
  getTotalMember(month: string) { return this.getRawValue('Total', 'Total Member', month); }
  getPerFOTotalOutstanding(month: string) { return this.getRawValue('Total', 'Per FO Total Outstanding', month) / this.usdRate; }
  getPerBorrowerLoanOutstanding(month: string) { return this.getRawValue('Total', 'Per Borrower Loan Outstanding', month) / this.usdRate; }

  // Table 3
  getAmountOfTotalOD(month: string) { return this.getRawValue('Total', 'Amount of Total OD', month) / this.usdRate; }
  getAdvanceCollectionRatio(month: string) { return this.getRawValue('Total', 'Advance Collection Ratio (%)', month) / 100; }

  // Table 4
  getTotalSavingsBalance(month: string) { return this.getRawValue('Total', 'Total Closing Savings Balance', month) / this.usdRate; }
  getSavingsPerMember(month: string) { return this.getRawValue('Total', 'Savings Per Member', month) / this.usdRate; }
  getSavingBalancePOSRatio(month: string) { return this.getRawValue('Total', 'Saving Balance and POS Ratio', month) / 100; }

  // Visuals
  getAverageLoanSizeNew(month: string) { return this.getRawValue('Total', 'Average Loan Size (New)', month) / this.usdRate; }
  getAverageLoanSizeRepeat(month: string) { return this.getRawValue('Total', 'Average Loan Size (Repeat)', month) / this.usdRate; }
}
