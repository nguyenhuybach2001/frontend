// Hàm gọi API chung
export default async function apiCaller({
  request,
  errorHandler = defaultErrorHandler, // Handler lỗi mặc định
}) {
  try {
    const response = await request(); // Gọi request được truyền vào
    return response;
  } catch (error) {
    errorHandler(error); // Xử lý lỗi với handler
  }

  return null; // Trả về null nếu có lỗi
}

// Hàm xử lý lỗi mặc định
function defaultErrorHandler(error) {
  console.error("An error occurred:", error);
}
