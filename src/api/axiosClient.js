import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor cho request
axiosClient.interceptors.request.use(async (config) => {
  const access_token = localStorage.getItem("access_token");

  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }

  return config;
});

// Interceptor cho response
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về response data nếu có
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Xử lý lỗi không có phản hồi từ server
    if (!error.response) {
      console.error("Unknown error:", error.message);
      return;
    }

    // Xử lý lỗi dựa trên mã trạng thái HTTP
    const { status, data } = error.response;
    if (status >= 500) {
      // TODO: Hiển thị thông báo lỗi từ server
      console.error("Server error:", data);
    } else if (400 <= status && status < 500) {
      throw data; // Quăng lỗi để phía trên xử lý
    }
  }
);

export default axiosClient;
