import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";


export const sameOrigin = (socket: Socket, next: (err?: ExtendedError)=> void)=>{
    const origin = socket.handshake.headers.origin
    const domain = process.env.SITE_URL
    
    //check if connection url is same with site
    if( origin !== domain) return next(new Error('Forbidden'))
    return next()
}

export const authenticate = (socket: Socket, next: (err?: ExtendedError) => void)=>{
    const { token } = socket.handshake.auth

    if(token && token == "hello-kitten"){
        return next()
    }
    return next(new Error("Authentication Error"))
}