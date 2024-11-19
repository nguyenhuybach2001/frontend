import axiosClient from "./axiosClient";

export const homeApi = {
  top_discount: (data) => {
    return () => {
      return axiosClient.post("/api/v1/products/top-discounts", {
        params: data,
      });
    };
  },
};
