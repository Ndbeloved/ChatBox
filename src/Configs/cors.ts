import dotenv from "dotenv"
dotenv.config()

export const corsCustomOption: Record<string, any> = {
    origin: process.env.SITE_URL,
    methods: ["GET", "POST"],
}