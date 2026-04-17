import dotenv from  'dotenv'
dotenv.config();

if (!process.env.PORT) {
    throw new Error("PORT is not defined in environment variables");
}

if (!process.env.MONDO_DB_URI) {
    throw new Error("MongoDB URI is not defined in environment variables");
}
if (!process.env.FRONTEND_URI) {
    throw new Error("Frontend URI is not defined in environment variables");
}
if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("Access token secret is not defined in environment variables");
}

if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("Google client id is not defined in environment variables");
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Google client secret is not defined in environment variables");
}

export const config = {
    PORT: process.env.PORT || 8000,
    MONGO_DB_URI: process.env.MONDO_DB_URI,
    FRONTEND_URI: process.env.FRONTEND_URI || "http://localhost:5173",
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRE: process.env.ACCESS_TOKEN_EXPIRE || '1d',
    GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET : process.env.GOOGLE_CLIENT_SECRET,
    NODE_ENV : process.env.NODE_ENV || 'development'
}