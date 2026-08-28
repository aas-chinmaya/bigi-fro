import { configureStore } from "@reduxjs/toolkit";
import mastersReducer from "@/modules/masters/store/masterSlice";
import roleAccessReducer from "@/modules/roleAccess/store/roleAccessSlice";
import userReducer from "@/modules/users/store/userSlice";
import authReducer from "@/modules/auth/store/authSlice";
import vendorReducer from "@/modules/vendor/store/vendorSlice";
import businessReducer from "@/modules/business/store/businessSlice";

//sales modules
import invoiceReducer from "@/modules/sales/invoice/store/invoice.slice";
import customersReducer from "@/modules/customers/store/customers.slice";
import moneyReceiptReducer  from "@/modules/sales/money-receipt/store/money-receipt.slice";

const store = configureStore({
  reducer: {
    masters: mastersReducer,
    roleAccess: roleAccessReducer,
    users: userReducer,
    auth: authReducer,
    vendors: vendorReducer,
    invoice: invoiceReducer,
    business: businessReducer,
    customers: customersReducer,
    moneyReceipt: moneyReceiptReducer ,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export default store;
