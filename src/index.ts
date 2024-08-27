import express, {Request, Response, NextFunction} from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import morgan  from "morgan"
import cors from "cors"
import bodyParser from "body-parser"
import http from "http"
import cookieParser from "cookie-parser"
import { Server } from "socket.io"
import { SocketIo } from "./Services/socket"
import { SocketController } from "./Services/socket-controller"
import { authenticate, sameOrigin } from "./Middleware/io-middleware"
import mongoose from "mongoose"
import { UserRoute } from "./Routes/user-route"

dotenv.config()
const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 3000
const dbURL = process.env.MONGO_URL || 'null'

//setting up server with socket.io
const io = SocketIo(server)

app.use(helmet())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(cors({
    origin: process.env.SITE_URL,
}))
app.use(bodyParser.json({limit: "1mb"}))

//middleware to prevent CSWSH and authenticate connections
io.use(sameOrigin)
io.use(authenticate)


//Socket io controllers
SocketController(io)

//routes
app.use("/auth/user", UserRoute)


app.get('/', (req: Request, res: Response)=>{
    const authToken = req.cookies['authToken']
    console.log("Get token: ", authToken)
    res.status(200).json({message: "getting cookies"})
})



app.use((req: Request, res: Response, next: NextFunction)=>{
    res.status(404).json({message: "Page not found"})
})

mongoose.connect( dbURL)
    .then(()=>{
        console.log("connected to mongodb...")
        server.listen(PORT, ()=>{
            console.log("server is running")
        })
    })
    .catch(err => {
        console.error("failed to connect to db: ",err)
    })