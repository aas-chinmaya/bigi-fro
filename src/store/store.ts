import { configureStore } from "@reduxjs/toolkit";
import mastersReducer from "@/modules/masters/store/masterSlice";
import roleAccessReducer from "@/modules/roleAccess/store/roleAccessSlice";
import userReducer from "@/modules/users/store/userSlice";
import authReducer from "@/modules/auth/store/authSlice";
import vendorReducer from "@/modules/vendor/store/vendorSlice";
import businessReducer from "@/modules/business/store/businessSlice";
import { masterReducer as businessSetupMasterReducer } from "@/modules/business/setup";
import globalDocumentTypeReducer from "@/modules/vendor/masters/store/globalDocumentTypeSlice";
import vendorCategoryReducer from "@/modules/vendor/masters/store/vendorCategorySlice";

//sales modules
import invoiceReducer from "@/modules/sales/invoice/slice/invoice.slice";
import invoiceItemReducer from "@/modules/sales/invoice/slice/invoiceItem-slice";
import customersReducer from "@/modules/customers/store/customers.slice";
import paymentReceiptReducer  from "@/modules/sales/payment-receipt/store/payment-receipt.slice";

const store = configureStore({
  reducer: {
    masters: mastersReducer,
    roleAccess: roleAccessReducer,
    users: userReducer,
    auth: authReducer,
    vendors: vendorReducer,
    invoice: invoiceReducer,
    invoiceItem: invoiceItemReducer,

        paymentReceipt: paymentReceiptReducer ,

    business: businessReducer,
    customers: customersReducer,
    businessSetupMasters: businessSetupMasterReducer,
    vendorDocumentTypes: globalDocumentTypeReducer,
    vendorCategories: vendorCategoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export default store;
