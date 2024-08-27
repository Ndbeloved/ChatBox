import { Server } from "socket.io";
import { getCountForUser, getUnreadCountsBySender, markMessagesRead, saveMessage } from "../Models/message-model";


export function SocketController(io: Server){
    io.on("connection", async(socket)=>{
        console.log(`New user ${socket.id} connected...`)

        //get userID
        const { userID, user } = socket.data.user


        //join your chat
        socket.join(userID)
        io.to(userID).emit("messageCount", {unread: await getUnreadCountsBySender(userID)})

        socket.on("privateMessage", async(data)=>{
            const { recipientID, message, replied, image, sender, read }  = data
            io.to(recipientID).emit('privateMessage', data)
            //save message to db
            await saveMessage(sender, recipientID, message, replied, image )
            //Notify receiver with the new message and updated count
            io.to(recipientID).emit("messageCount", {unread: await getUnreadCountsBySender(recipientID)})
        })

        socket.on("markAsRead", async(data)=>{
            const { receiverID, senderID} = data
            if(receiverID && senderID){
                console.log("read by: ", senderID)
                await markMessagesRead(senderID, receiverID)
                io.to(userID).emit("messageCount", {unread: await getUnreadCountsBySender(userID)})
            }
        })
    
        socket.on("disconnect", ()=>{
            console.log(`User ${socket.id} left the connection...`)
        })
    })
}