import {Router } from  'express'
import { resgisterUser } from '../controller/user.controller.js';
import { registerValidator } from '../validaters/auth.validator.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = Router();


router.route('/register').post(registerValidator, resgisterUser)




export default router;