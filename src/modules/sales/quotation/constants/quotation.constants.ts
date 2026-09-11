// ============================================================
// modules/sales/quotation/constants/quotation.constants.ts
// ============================================================

export const DEFAULT_COMPANY = {
  fromName: "AAS International Pvt Ltd",
  fromEmail: "accounts@aasinternational.com",
  fromPhone: "+91 98765 43210",
  fromGstin: "21ABACA8267F1ZX",
  fromPan: "ABACA8267F",
  fromAddressLine1: "Plot 52, 2nd floor, Bapuji Nagar, Unit 1",
  fromAddressLine2: "",
  fromCity: "Bhubaneswar",
  fromState: "Odisha",
  fromCountry: "India",
  fromPincode: "751009",
  fromLogoUrl: "",
};

export const DEFAULT_BANK_ACCOUNTS = [
  {
    id: "bank_1",
    bankName: "State Bank of India",
    accountNumber: "123456789012",
    ifsc: "SBIN0001234",
    accountHolderName: "AAS International Pvt Ltd",
    branch: "Bhubaneswar Main",
  },
  {
    id: "bank_2",
    bankName: "HDFC Bank",
    accountNumber: "987654321098",
    ifsc: "HDFC0001234",
    accountHolderName: "AAS International Pvt Ltd",
    branch: "Saheed Nagar",
  },
];

export const DEFAULT_UPI_IDS = [
  {
    id: "upi_1",
    upiId: "paymentaasint@sbi",
    linkedBank: "State Bank of India",
  },
  {
    id: "upi_2",
    upiId: "aasinternational@okhdfcbank",
    linkedBank: "HDFC Bank",
  },
];

export const DEFAULT_TERMS = [
  "Applicable taxes will be extra.",
  "Work will resume after advance payment.",
  "Payment to be made within 15 days of invoice.",
  "Prices are valid for 15 days from the date of quotation.",
];

export const GST_RATES = [0, 5, 12, 18, 28];

export const UNITS = [
  "pcs",
  "nos",
  "kg",
  "g",
  "ltr",
  "ml",
  "mtr",
  "sqft",
  "hour",
  "day",
  "month",
  "box",
  "set",
];