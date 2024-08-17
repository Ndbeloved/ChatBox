import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { verifyToken } from "../Utils/JWTtoken";
import cookie from "cookie"


export const sameOrigin = (socket: Socket, next: (err?: ExtendedError)=> void)=>{
    const origin = socket.handshake.headers.origin
    const domain = process.env.SITE_URL
    
    //check if connection url is same with site
    if( origin !== domain) return next(new Error('Forbidden'))
    return next()
}

export const authenticate = (socket: Socket, next: (err?: ExtendedError) => void)=>{
    const cookies = socket.request.headers.cookie

    if(cookies){
        const parsedCookie = cookie.parse(cookies)
        const authToken = parsedCookie['authToken']
        if(authToken && verifyToken(authToken)){
            const payload = verifyToken(authToken)
            socket.data.user = payload
            return next()
        }
    }
    return next(new Error("Authentication Error"))
}