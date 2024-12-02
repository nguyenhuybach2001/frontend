import axiosClient from "./axiosClient";

export const analysisApi = {
  revenue: (data) => {
    return () => {
      return axiosClient.get("/api/v1/analysis/category_revenue", {
        headers: { Authorization: `Bearer ${data.token}` },
        params: { platform: data.type },
      });
    };
  },
  category_qtt_sold: (data) => {
    return () => {
      return axiosClient.get("/api/v1/analysis/category_qtt_sold", {
        headers: { Authorization: `Bearer ${data.token}` },
        params: { platform: data.type },
      });
    };
  },
  tiki_price_rage: (data) => {
    return () => {
      return axiosClient.get("/api/v1/analysis/tiki_price_rage", {
        headers: { Authorization: `Bearer ${data.token}` },
      });
    };
  },
  sendo_price_rage: (data) => {
    return () => {
      return axiosClient.get("/api/v1/analysis/sendo_price_rage", {
        headers: { Authorization: `Bearer ${data.token}` },
      });
    };
  },
  shop_revenue: (data) => {
    return () => {
      return axiosClient.get("/api/v1/analysis/shop_revenue", {
        headers: { Authorization: `Bearer ${data.token}` },
        params: { platform: data.type },
      });
    };
  },
};
