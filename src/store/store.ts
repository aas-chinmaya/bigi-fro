import { configureStore } from "@reduxjs/toolkit";
import mastersReducer from "@/modules/masters/store/masterSlice";
import roleAccessReducer from "@/modules/roleAccess/store/roleAccessSlice";
import userReducer from "@/modules/users/store/userSlice";
import authReducer from "@/modules/auth/store/authSlice";
import vendorReducer from "@/modules/vendor/store/vendorSlice";
import businessReducer from "@/modules/business/store/businessSlice";

//sales modules
import invoiceReducer from "@/modules/sales/invoice/store/invoice.slice";
// import invoiceItemReducer from "@/modules/sales/invoice/store/invoiceItem-slice";
import customersReducer from "@/modules/customers/store/customers.slice";
import cashReceiptReducer  from "@/modules/sales/cash-receipt/store/cash-receipt.slice";

const store = configureStore({
  reducer: {
    masters: mastersReducer,
    roleAccess: roleAccessReducer,
    users: userReducer,
    auth: authReducer,
    vendors: vendorReducer,
    invoice: invoiceReducer,
    // invoiceItem: invoiceItemReducer,
    business: businessReducer,
    customers: customersReducer,
    cashReceipt: cashReceiptReducer ,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export default store;
