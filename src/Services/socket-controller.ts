import { Server } from "socket.io";


export function SocketController(io: Server){
    io.on("connection", (socket)=>{
        console.log(`New user ${socket.id} connected...`)

        //get userID
        const { userID, user } = socket.data.user


        //join your chat
        socket.join(userID)

        socket.on("privateMessage", (data)=>{
            const { recipientID, message }  = data
            io.to(recipientID).emit('privateMessage', {
                sender: user.username || "demo",
                message,
            })
        })
    
        socket.on("disconnect", ()=>{
            console.log(`User ${socket.id} left the connection...`)
        })
    })
}