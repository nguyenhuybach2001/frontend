import axiosClient from "./axiosClient";

export const trackingApi = {
  dataSHop: (data) => {
    return () => {
      return axiosClient.get("/api/v1/users/tracking/tracked-shop-data", {
        headers: { Authorization: `Bearer ${data.token}` },
      });
    };
  },
  check_shop: (data) => {
    return () => {
      return axiosClient.get("/api/v1/users/tracking/check-shop-info", {
        headers: { Authorization: `Bearer ${data.token}` },
        params: data.data,
      });
    };
  },
  add_shop: (data) => {
    return () => {
      return axiosClient.post(
        "/api/v1/users/tracking/create-tracking-shop",
        data.data,
        {
          headers: { Authorization: `Bearer ${data.token}` },
        }
      );
    };
  },
  extendDate: (data) => {
    return () => {
      return axiosClient.post(
        "/api/v1/users/tracking/tracked-shop/extend-date",
        data.data,
        {
          headers: { Authorization: `Bearer ${data.token}` },
        }
      );
    };
  },
  detail_shop: (data) => {
    return () => {
      return axiosClient.get("/api/v1/users/tracking/tracked-shop/detail", {
        headers: { Authorization: `Bearer ${data.token}` },
        params: { shop_id: data.shop_id },
      });
    };
  },
};
