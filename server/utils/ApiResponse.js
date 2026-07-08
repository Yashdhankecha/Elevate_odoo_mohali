/**
 * @class ApiResponse
 * Standard API response wrapper — ensures all responses have consistent shape.
 * Usage: res.status(200).json(new ApiResponse(200, data, "Fetched successfully"))
 */
class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

module.exports = ApiResponse;
