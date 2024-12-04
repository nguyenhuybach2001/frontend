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
  dataProduct: () => {
    return () => {
      return axiosClient.get("/api/v1/users/tracking/tracked-product-data");
    };
  },
  check_product: (data) => {
    return () => {
      return axiosClient.get("/api/v1/users/tracking/check-product-info", {
        headers: { Authorization: `Bearer ${data.token}` },
        params: data.data,
      });
    };
  },
  add_product: (data) => {
    return () => {
      return axiosClient.post(
        "/api/v1/users/tracking/create-tracking-product",
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
  extendDateProduct: (data) => {
    return () => {
      return axiosClient.post(
        "/api/v1/users/tracking/tracked-product/extend-date",
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
  detail_product: (data) => {
    return () => {
      return axiosClient.get("/api/v1/users/tracking/tracked-product/detail", {
        headers: { Authorization: `Bearer ${data.token}` },
        params: { product_id: data.product_id },
      });
    };
  },
  products_shop: (data) => {
    return () => {
      return axiosClient.get(
        "/api/v1/users/tracking/tracked-shop/detail/products",
        {
          headers: { Authorization: `Bearer ${data.token}` },
          params: data.data,
        }
      );
    };
  },
};
