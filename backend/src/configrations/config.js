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

export const config = {
    PORT: process.env.PORT || 8000,
    MONGO_DB_URI: process.env.MONDO_DB_URI,
    FRONTEND_URI: process.env.FRONTEND_URI || "http://localhost:5173",
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRE: process.env.ACCESS_TOKEN_EXPIRE || '1d'
}