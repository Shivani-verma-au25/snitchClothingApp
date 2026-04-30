import {Router } from 'express'
import { isSellerAuthenticated } from '../middlewares/auth.middleware.js';
import { addProductVariants, createProducts, getAllproducts, getProductCreatedBySeller, getProductDetails } from '../controller/product.controller.js';
import {upload} from '../middlewares/multer.middleware.js';
import { createProductValidator } from '../validaters/product.validator.js'
const router = Router();

//  protected routes
router.route('/create' ,).post( isSellerAuthenticated , upload.array('images' ,8) ,createProductValidator , createProducts)
router.route('/seller').get(isSellerAuthenticated , getProductCreatedBySeller);

// variants
router.route('/:productId/add-variant').post(isSellerAuthenticated , upload.array("images",8),createProductValidator , addProductVariants )

//public url
router.route('/all-products').get( getAllproducts);
router.route('/product-detail/:id').get( getProductDetails);


export default router;