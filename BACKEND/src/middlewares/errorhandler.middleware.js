// errorHandler.middleware.js
import { ApiError } from "../utils/ApiError.js";
const errorHandler = (err, req, res, next) => {
    // Check if error is an instance of ApiError
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors,
            data: err.data
        });
    }
    console.log(err);

    // Handle other types of errors
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        errors: [err.message],
        data: null
    });
};

export { errorHandler };