import JWT from "jsonwebtoken"
import { IJWTPayload } from "../Interface/jwt-interface"

const JwtSecret = process.env.JWT_SECRET || "papaya_papaya"

//signs jwt tokens
export function signToken(payload: IJWTPayload): string{
    return JWT.sign(payload, JwtSecret, { expiresIn: '24hr'})
}


//verifies JWT tokens
export function verifyToken(token: string): IJWTPayload | null{
    try{
        return JWT.verify(token, JwtSecret) as IJWTPayload
    }
    catch(error){
        console.error("Token verification failed: ",error)
        return null
    }
}