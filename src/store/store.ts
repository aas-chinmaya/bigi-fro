// import { configureStore } from "@reduxjs/toolkit";
// import mastersReducer from "@/modules/masters/store/masterSlice";
// import roleAccessReducer from "@/modules/roleAccess/store/roleAccessSlice";
// import userReducer from "@/modules/users/store/userSlice";
// import authReducer from "@/modules/auth/store/authSlice";
// import vendorReducer from "@/modules/vendor/store/vendorSlice";
// import businessReducer from "@/modules/business/store/businessSlice";
// import { masterReducer as businessSetupMasterReducer } from "@/modules/business/setup";
// import globalDocumentTypeReducer from "@/modules/vendor/masters/store/globalDocumentTypeSlice";
// import vendorCategoryReducer from "@/modules/vendor/masters/store/vendorCategorySlice";


// //sales modules
// import invoiceReducer from "@/modules/sales/invoice/store/invoice.slice";
// import customersReducer from "@/modules/customers/store/customers.slice";
// import paymentReceiptReducer  from "@/modules/sales/payment-receipt/store/payment-receipt.slice";
// import quotationReducer  from "@/modules/sales/quotation/store/quotation.slice";


// const store = configureStore({
//   reducer: {
//     masters: mastersReducer,
//     roleAccess: roleAccessReducer,
//     users: userReducer,
//     auth: authReducer,
//     vendors: vendorReducer,


//     //sales modules
//     invoice: invoiceReducer,
//     paymentReceipt: paymentReceiptReducer ,
//     quotation: quotationReducer ,


//     customers: customersReducer,


//     business: businessReducer,
//     businessSetupMasters: businessSetupMasterReducer,
//     vendorDocumentTypes: globalDocumentTypeReducer,
//     vendorCategories: vendorCategoryReducer,
//   },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
// export type AppStore = typeof store;

// export default store;









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

// Sales modules
import invoiceReducer from "@/modules/sales/invoice/store/invoice.slice";
// import quotationReducer from "@/modules/sales/quotations/store/quotation.slice";
import customersReducer from "@/modules/customers/store/customers.slice";
import paymentReceiptReducer from "@/modules/sales/payment-receipt/store/payment-receipt.slice";

// RTK Query
import { baseApi } from "@/services/baseApi";

const store = configureStore({
  reducer: {
    // Existing Redux modules
    masters: mastersReducer,
    roleAccess: roleAccessReducer,
    users: userReducer,
    auth: authReducer,
    vendors: vendorReducer,

    // Sales modules
    invoice: invoiceReducer,
    paymentReceipt: paymentReceiptReducer,
    customers: customersReducer,
    // quotation: quotationReducer ,
    // Other modules
    business: businessReducer,
    businessSetupMasters: businessSetupMasterReducer,
    vendorDocumentTypes: globalDocumentTypeReducer,
    vendorCategories: vendorCategoryReducer,

    // RTK Query
    [baseApi.reducerPath]: baseApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export default store;