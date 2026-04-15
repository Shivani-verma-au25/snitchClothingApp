import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";


// utils/formatValidationErrors.js
const formatValidationErrors = (errors) => {
    const formatted = {}

    errors.array().forEach(err => {
        if (!formatted[err.path]) {
            formatted[err.path] = err.msg
        }
    })

    return formatted
}


export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success : false,
      errors : formatValidationErrors(errors)
    })

    // return res.status(400).json(
    //   new ApiError(400, "Received data is not valid", extractedErrors)
    // );
  }

  next();
};
