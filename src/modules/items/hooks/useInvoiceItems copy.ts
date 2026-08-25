

"use client";

import { useMemo } from "react";
import { useProducts } from "./useProducts";
import { useServices } from "./useServices";

export function useInvoiceItems() {
  const productsState = useProducts();
  const servicesState = useServices();

  const items = useMemo(() => {
    const products = (productsState.products || []).map((product) => ({
      id: product.id,
      name: product.itemName,
      description: product.description,
      type: "PRODUCT" as const,
      classification: "GOODS" as const,
      itemCode: product.itemCode,
      salePrice: product.salePrice || 100,
      unit: product.inventoryUnit?.shortName,
      hsnSacCode: product.hsnCode,
      tax: product.tax, // Passes the entire tax object (cgst, sgst, igst, cess, etc.)
      categoryName: product.category?.categoryName,
      brandName: product.brand?.brandName,
    }));

    const services = (servicesState.services || []).map((service) => ({
      id: service.id,
      name: service.serviceName,
      description: service.description,
      type: "SERVICE" as const,
      classification: "SERVICES" as const,
      itemCode: service.serviceCode,
      salePrice: service.serviceCharge || 100,
      unit: service.unit,
      hsnSacCode: service.sacCode,
      tax: service.tax, // Passes the entire tax object (cgst, sgst, igst, cess, etc.)
      categoryName: service.category?.categoryName,
      brandName: service.brand?.brandName,
    }));

    return [...products, ...services];
  }, [productsState.products, servicesState.services]);

  return {
    items,
    loading: productsState.loading || servicesState.loading,
  };
}








// "use client";

// import { useMemo } from "react";

// export function useInvoiceItems() {
//   // Dummy response from products API
//   const productsState = {
//     products: [
//       {
//         id: "product-001",
//         itemName: "Laptop",
//         description: "Business laptop",
//         itemCode: "LAP-001",
//         salePrice: 55000,
//         inventoryUnit: {
//           shortName: "PCS",
//         },
//         hsnCode: "8471",
//         tax: {
//           cgst: 9,
//           sgst: 9,
//           igst: 18,
//           cess: 0,
//         },
//         category: {
//           categoryName: "Electronics",
//         },
//         brand: {
//           brandName: "Dell",
//         },
//       },
//       {
//         id: "product-002",
//         itemName: "Wireless Mouse",
//         description: "Wireless optical mouse",
//         itemCode: "MOU-001",
//         salePrice: 1200,
//         inventoryUnit: {
//           shortName: "PCS",
//         },
//         hsnCode: "8471",
//         tax: {
//           cgst: 9,
//           sgst: 9,
//           igst: 18,
//           cess: 0,
//         },
//         category: {
//           categoryName: "Accessories",
//         },
//         brand: {
//           brandName: "Logitech",
//         },
//       },
//     ],
//     loading: false,
//   };

//   // Dummy response from services API
//   const servicesState = {
//     services: [
//       {
//         id: "service-001",
//         serviceName: "Web Development",
//         description: "Frontend web development service",
//         serviceCode: "WEB-001",
//         serviceCharge: 25000,
//         unit: "HOUR",
//         sacCode: "998314",
//         tax: {
//           cgst: 9,
//           sgst: 9,
//           igst: 18,
//           cess: 0,
//         },
//         category: {
//           categoryName: "Development",
//         },
//         brand: null,
//       },
//       {
//         id: "service-002",
//         serviceName: "UI/UX Design",
//         description: "Website UI/UX design service",
//         serviceCode: "DES-001",
//         serviceCharge: 15000,
//         unit: "PROJECT",
//         sacCode: "998391",
//         tax: {
//           cgst: 9,
//           sgst: 9,
//           igst: 18,
//           cess: 0,
//         },
//         category: {
//           categoryName: "Design",
//         },
//         brand: null,
//       },
//     ],
//     loading: false,
//   };

//   const items = useMemo(() => {
//     const products = (productsState.products || []).map((product) => ({
//       id: product.id,
//       name: product.itemName,
//       description: product.description,
//       type: "PRODUCT" as const,
//       classification: "GOODS" as const,
//       itemCode: product.itemCode,
//       salePrice: product.salePrice || 100,
//       unit: product.inventoryUnit?.shortName,
//       hsnSacCode: product.hsnCode,
//       tax: product.tax,
//       categoryName: product.category?.categoryName,
//       brandName: product.brand?.brandName,
//     }));

//     const services = (servicesState.services || []).map((service) => ({
//       id: service.id,
//       name: service.serviceName,
//       description: service.description,
//       type: "SERVICE" as const,
//       classification: "SERVICES" as const,
//       itemCode: service.serviceCode,
//       salePrice: service.serviceCharge || 100,
//       unit: service.unit,
//       hsnSacCode: service.sacCode,
//       tax: service.tax,
//       categoryName: service.category?.categoryName,
//       brandName: service.brand?.brandName,
//     }));

//     return [...products, ...services];
//   }, [productsState.products, servicesState.services]);

//   return {
//     items,
//     loading: productsState.loading || servicesState.loading,
//   };
// }
