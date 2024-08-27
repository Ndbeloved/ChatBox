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
                isRead: false,
                receiverID: new mongoose.Types.ObjectId(userID)
            }}, //filtering only unread messages
            { $group: {
                _id: "$senderID",
                count: { $sum: 1}
            }}, //group by senderID and count unread messages
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "senderInfo"
                }
            },
            {
                $unwind: "$senderInfo"
            },
            {
                $project: {
                    senderName: "$senderInfo.username",
                    count: 1,
                }
            }
        ])

        const results = unreadCounts.reduce((acc, curr)=>{
            acc[curr.senderName] = curr.count
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