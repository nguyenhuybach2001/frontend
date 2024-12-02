import axiosClient from "./axiosClient";

export const authApi = {
  login: (data) => {
    return () => {
      return axiosClient.post("/auth/login", data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    };
  },
  user: (data) => {
    return () => {
      return axiosClient.get("/users/me", {
        headers: { Authorization: `Bearer ${data.token}` },
      });
    };
  },
  signup: (data) => {
    return () => {
      return axiosClient.post("/users", data);
    };
  },
  verify: (data) => {
    return () => {
      return axiosClient.post("/users/verify", data);
    };
  },
  forget: (data) => {
    return () => {
      return axiosClient.post("/auth/forgot-password", data);
    };
  },
  resetPass: (data) => {
    return () => {
      return axiosClient.put("/auth/reset-password", data);
    };
  },
};
