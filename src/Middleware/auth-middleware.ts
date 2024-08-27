import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../Utils/JWTtoken";

interface CustomRequest extends Request{
    user?: any 
}

export function isAuthenticated(req: CustomRequest, res: Response, next: NextFunction ){

    const token = req.headers["authorization"] || null
    console.log("token: ", token)
    if(!token){
        return res.status(403).json({success: false, message: "provide auth token"})
    }

    const payload = verifyToken(token)
    if(!payload) return res.status(400).json({success: false, message: "User authorization failed"})

    req.user = payload.user
    next()
}