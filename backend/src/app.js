import express from "express";
import cors from  'cors';
import cookieParser from  'cookie-parser';
import morgan from 'morgan';
import { config } from "./configrations/config.js";
import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";


const app = express();

// middlewares
// app.use(cors({
//     origin : config.FRONTEND_URI,
//     credentials : true
// }))

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
app.use(morgan('dev'));



// passport configuration
app.use(passport.initialize());
passport.use(new GoogleStrategy({
    clientID : config.GOOGLE_CLIENT_ID,
    clientSecret :config.GOOGLE_CLIENT_SECRET,
    callbackURL : '/api/auth/google/callback'
} , (accessToken, refreshToken, profile, done) => {
    return done(null ,profile);
}))

// import routes 

import authRouter from './routers/auth.routers.js';
// use routes
app.use('/api/auth',authRouter);


// health check route
app.get('/health-check',(req, res) =>{
    return res.status(200).json({
        message : 'health check successfull.'
    })
})


export {app};
