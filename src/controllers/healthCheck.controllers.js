import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const healthCheck = asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, [], "Server is Running"));
});

export { healthCheck };
