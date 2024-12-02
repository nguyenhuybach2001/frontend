import axiosClient from "./axiosClient";

export const productApi = {
  productDetail: (data) => {
    return () => {
      return axiosClient.get("/api/v1/products", {
        params: data,
      });
    };
  },
  relateProduct: (data) => {
    return () => {
      return axiosClient.get("/api/v1/products/related", {
        params: data,
      });
    };
  },
  listProducts: (data) => {
    return () => {
      return axiosClient.get("/api/v1/products/listing", {
        params: data,
      });
    };
  },
  searchProducts: (data) => {
    return () => {
      return axiosClient.get("/api/v1/products/search", {
        params: data,
      });
    };
  },
};
