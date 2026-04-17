import {body} from 'express-validator'
import { validate } from '../middlewares/validate.middleware.js'

export const registerValidator = [
    body('fullname')
    .trim()
    .notEmpty().withMessage("Fullname is required.")
    .isLength({min : 3}).withMessage("Fullname must be at least 3 characters long."),

    body('email')
    .trim()
    .notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Invalid email address."),

    body("password")
    .trim()
    .notEmpty().withMessage("Password is required.")
    .isLength({min : 6}).withMessage("Password must be at least 6 characters long."),

    body('contact')
    .trim()
    .notEmpty().withMessage("Contact is required.")
    .isMobilePhone().withMessage("Invalid contact number."),

    // body('isSeller')
    // .isBoolean().withMessage("isSeller must be a boolean value."),
    validate

]


export const loginValidator = [
    body('email')
    .trim()
    .notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Invalid email address."),

    body('password')
    .trim()
    .notEmpty().withMessage("Password is required.")
    .isLength({min: 6}).withMessage("Password must be at least 6 characters long."), 

    validate
]