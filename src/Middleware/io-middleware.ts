import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { verifyToken } from "../Utils/JWTtoken";


export const sameOrigin = (socket: Socket, next: (err?: ExtendedError)=> void)=>{
    const origin = socket.handshake.headers.origin
    const domain = process.env.SITE_URL
    
    //check if connection url is same with site
    if( origin !== domain) return next(new Error('Forbidden'))
    return next()
}

export const authenticate = (socket: Socket, next: (err?: ExtendedError) => void)=>{
    const { tokens } = socket.handshake.auth

    if(tokens){
        if(tokens && verifyToken(tokens)){
            const payload = verifyToken(tokens)
            socket.data.user = payload
            return next()
        }
    }
    return next(new Error("Authentication Error"))
}