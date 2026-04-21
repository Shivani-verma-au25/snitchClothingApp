import {Router } from 'express'
import { isSellerAuthenticated } from '../middlewares/auth.middleware.js';
import { createProducts, getAllproducts, getProductCreatedBySeller, getProductDetails } from '../controller/product.controller.js';
import {upload} from '../middlewares/multer.middleware.js';
const router = Router();

//  protected routes
router.route('/create' ,).post( isSellerAuthenticated , upload.array('images' ,8) ,createProducts)
router.route('/seller').get(isSellerAuthenticated , getProductCreatedBySeller);

//public url
router.route('/all-products').get( getAllproducts);
router.route('/product-detail/:id').get( getProductDetails);


export default router;