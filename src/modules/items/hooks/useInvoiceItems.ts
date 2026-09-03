import { useEffect, useState } from "react";
import { productservice } from "../services/product.service";
import { serviceservice } from "../services/service.service";

export const useInvoiceItems = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getInvoiceItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productResponse, serviceResponse] = await Promise.all([
        productservice.getAllProducts(),
        serviceservice.getAllServices(),
      ]);

      const products =
        productResponse?.data?.data?.data ??
        productResponse?.data?.data ??
        productResponse?.data ??
        productResponse ??
        [];

      const services =
        serviceResponse?.data?.data?.data ??
        serviceResponse?.data?.data ??
        serviceResponse?.data ??
        serviceResponse ??
        [];

      const normalizedProducts = products.map((product: any) => ({
        id: product.id,
        name: product.itemName,
        description: product.description,

        type: "PRODUCT" as const,
        classification: "GOODS" as const,

        itemCode: product.itemCode,
        salePrice: product.salePrice ?? 100,

        unit: product.inventoryUnit?.shortName,
        hsnSacCode: product.hsnCode,

        tax: product.tax,

        categoryName: product.category?.categoryName,
        brandName: product.brand?.brandName,

        rawItem: product,
      }));

      const normalizedServices = services.map((service: any) => ({
        id: service.id,
        name: service.serviceName,
        description: service.description,

        type: "SERVICE" as const,
        classification: "SERVICES" as const,

        itemCode: service.serviceCode,
        salePrice: service.serviceCharge ?? 0,

        unit: service.unit,
        hsnSacCode: service.sacCode,

        tax: service.tax,

        categoryName: service.category?.categoryName,
        brandName: service.brand?.brandName,

        rawItem: service,
      }));

      setItems([
        ...normalizedProducts,
        ...normalizedServices,
      ]);
    } catch (error: any) {
      setError(error?.message || "Failed to fetch invoice items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInvoiceItems();
  }, []);

  return {
    items,
    loading,
    error,
    refetch: getInvoiceItems,
  };
};