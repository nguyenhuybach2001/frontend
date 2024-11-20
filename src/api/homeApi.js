import axiosClient from "./axiosClient";

export const homeApi = {
  top_discount: (data) => {
    return () => {
      return axiosClient.get("/api/v1/products/top-discounts", {
        params: data,
      });
    };
  },
  list_category: (data) => {
    return () => {
      return axiosClient.get("/api/v1/products/list-categories", {
        params: data,
      });
    };
  },
};
