import express, {Request, Response, NextFunction} from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import morgan  from "morgan"
import cors from "cors"
import bodyParser from "body-parser"
import http from "http"
import { Server } from "socket.io"
import { SocketIo } from "./Services/socket"
import { SocketController } from "./Services/socket-controller"

dotenv.config()
const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 3000

//setting up server with socket.io
const io = SocketIo(server)

app.use(helmet())
app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.json({limit: "1mb"}))


//Socket io controllers
SocketController(io)




app.use((req: Request, res: Response, next: NextFunction)=>{
    res.status(404).json({message: "Page not found"})
})

server.listen(PORT, ()=>{
    console.log("server is running")
})