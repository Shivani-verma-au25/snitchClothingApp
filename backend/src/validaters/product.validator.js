import {body} from 'express-validator'
import {validate} from '../middlewares/validate.middleware.js'


export const createProductValidator = [
    body('title')
    .trim()
    .notEmpty().withMessage("Title is Required."),

    body('description')
    .trim()
    .notEmpty().withMessage("Description is required."),

    body("priceAmount")
    .isNumeric().withMessage("Price amount must be number"),

    body('priceCurrency')
    .notEmpty().withMessage("Price currency is required."),
    validate

]