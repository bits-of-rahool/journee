class ApiError extends Error {
  constructor(statusCode=699, message="Kuch Toh Error Hai") {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
export default ApiError;