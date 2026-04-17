import {Router } from  'express'
import { googleCallback, loginUser, resgisterUser } from '../controller/user.controller.js';
import { loginValidator, registerValidator } from '../validaters/auth.validator.js';
import passport from 'passport';
import { config } from '../configrations/config.js';

const router = Router();


router.route('/register').post(registerValidator, resgisterUser)
router.route('/login').post(loginValidator, loginUser)

// google auth route

router.route('/google').get(passport.authenticate('google',{ scope :[ 'profile' ,'email']}))
router.route('/google/callback').get(
    passport.authenticate('google',{ 
        session : false,
        failureFlash : config.NODE_ENV === 'development' ? 'http://localhost:5173/login' : '/login'        
        }) 
    ,googleCallback)





export default router;