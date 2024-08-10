import { Server } from "socket.io";


export function SocketController(io: Server){
    io.on("connection", (socket)=>{
        console.log(`New user ${socket.id} connected...`)

        //join room
        socket.on("join", (userID)=>{
            socket.join(userID)
            console.log(`User with id ${socket.id} joined the room ${userID}`)
        })

        socket.on("private_message", (data)=>{
            const { receiverID, senderID, message, chatID }  = data
            io.to(chatID).emit('receive_message', {senderID, message})
        })
    
        socket.on("disconnect", ()=>{
            console.log(`User ${socket.id} left the connection...`)
        })
    })
}