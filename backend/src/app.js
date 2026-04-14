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


export {app};
