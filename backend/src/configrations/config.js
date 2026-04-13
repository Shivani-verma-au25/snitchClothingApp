import dotenv from  'dotenv'
dotenv.config();

if (!process.env.PORT) {
    throw new Error("PORT is not defined in environment variables");
}

if (!process.env.MONDO_DB_URI) {
    throw new Error("MongoDB URI is not defined in environment variables");
}

export const config = {
    PORT: process.env.PORT || 8000,
    MONGO_DB_URI: process.env.MONDO_DB_URI
}