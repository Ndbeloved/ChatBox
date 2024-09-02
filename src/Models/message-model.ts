import mongoose, {Schema} from "mongoose"


const messageSchema = new Schema({
    senderID: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    receiverID: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    content:{
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        immutable: false
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    replied: {
        type: String,
    },
    image:{
        type: String,
    }
})


const MessageModel = mongoose.model("messages", messageSchema)

export async function markMessagesRead(senderID: String , receiverID: String){
    try{
        await MessageModel.updateMany({senderID: receiverID, receiverID: senderID, isRead: false}, { $set: {isRead: true }})
        return true
    }
    catch(error){
        console.error(error)
        return false
    }
}


export async function getUnreadCountsBySender(userID: string){
    try{
        const unreadCounts = await MessageModel.aggregate([
            { $match: { 
                $or: [
                    { receiverID: new mongoose.Types.ObjectId(userID) }, // User is the receiver
                    { senderID: new mongoose.Types.ObjectId(userID) }    // User is the sender
                ]
            }}, //filtering only unread messages
            { $group: {
                    _id: {
                        $cond: [
                        { $eq: ["$receiverID", new mongoose.Types.ObjectId(userID)] },
                        "$senderID",
                        "$receiverID"
                        ]
                    },  // Group by the opposite party
                    count: {
                        $sum: {
                            $cond: [{ $and: [{ $eq: ["$isRead", false] }, { $eq: ["$receiverID", new mongoose.Types.ObjectId(userID)] }] }, 1, 0]
                        }
                    }, // Count unread messages for this user
                    totalMessages: { $sum: 1 }, // Count all messages with this user
                    latestMessage: { $last: "$$ROOT" }, // Keep the latest message (sent or received)
                }
            }, //group by senderID and count unread messages
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            {
                $unwind: "$userInfo"
            },
            {
                $sort: {
                  "latestMessage.timestamp": -1, // Sort by the time of the latest message in descending order
                },
            },
            {
                $project: {
                    senderID: "$_id",
                    senderName: "$userInfo.username",
                    count: 1, 
                    totalMessages: 1,
                    latestMessage: 1,
                }
            }
        ])

        const results = unreadCounts.reduce((acc, curr)=>{
            acc[curr.senderName] = {
                senderID: curr.senderID,
                count: curr.count,
                totalMessages: curr.totalMessages,
                latestMessage: curr.latestMessage,
            }
            return acc
        }, {})

        return results
    }
    catch(error){
        console.error(error)
        return false
    }
}

export async function getCountForUser(userID: string){
    try{
        const count = await MessageModel.countDocuments({receiverID: userID, isRead: false })
        return count
    }
    catch(error){
        console.error(error)
        return false
    }
}

export async function saveMessage(senderID: string, receiverID: string, content: string, replied: string, image: string){
    const message = new MessageModel({
        senderID,
        receiverID,
        content,
        replied,
        image
    })

    await message.save()
}