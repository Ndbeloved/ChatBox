import { Server } from "socket.io";
import { Server as httpServer} from "http"
import { corsCustomOption } from "../Configs/cors";



export function SocketIo(server: httpServer){
    const io = new Server(server, {
        cors: corsCustomOption
    })
    return io
}