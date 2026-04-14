import express from "express";
import cors from  'cors';
import cookieParser from  'cookie-parser';
import morgan from 'morgan';
import { config } from "./configrations/config.js";


const app = express();

// middlewares
app.use(cors({
    origin : config.FRONTEND_URI,
    credentials : true
}))

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
app.use(morgan('combined'));

// import routes 

import authRouter from './routers/auth.routers.js';
// use routes
app.use('/api/v1/auth',authRouter);


// health check route
app.get('/health-check',(req, res) =>{
    return res.status(200).json({
        message : 'health check successfull.'
    })
})


export {app};
