import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map(err => ({
      [err.path]: err.msg,
    }));

    return res.status(400).json(
      new ApiError(400, "Received data is not valid", extractedErrors)
    );
  }

  next();
};
