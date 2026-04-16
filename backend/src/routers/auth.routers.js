import {Router } from  'express'
import { loginUser, resgisterUser } from '../controller/user.controller.js';
import { loginValidator, registerValidator } from '../validaters/auth.validator.js';

const router = Router();


router.route('/register').post(registerValidator, resgisterUser)
router.route('/login').post(loginValidator, loginUser)




export default router;