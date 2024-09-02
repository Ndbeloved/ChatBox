import mongoose, { Schema } from "mongoose"
import { ICreateUserPayload } from "../Interface/user-model-interface"
import { MessageModel } from "./message-model"


const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    }
}, {timestamps: true})

const UserModel = mongoose.model("users", UserSchema)

export async function createUser(payload: ICreateUserPayload): Promise<ICreateUserPayload | false>{
    try{
        const { username } = payload

        const user = await UserModel.create({
            username
        })

        return user
    }
    catch(error){
        console.error(error)
        return false
    }
}

export async function getUserID(id: string){
    try{
        if(id){
            const user = await UserModel.findById(id)
            return user
        }
        else{
            console.error("No Username or Id parsed to getUser")
            return false
        }
    }
    catch(error){
        console.error(error)
        return false
    }
}

export async function getUserName(username: string){
    try{
        if(username){
            const user = await UserModel.findOne({username: username})
            return user
        }
        else{
            console.error("No Username or Id parsed to getUser")
            return false
        }
    }
    catch(error){
        console.error(error)
        return false
    }
}

export async function getUsers(id: string){
    try{
        const users = await UserModel.find({_id: {$ne: id}})
        console.log(`id: ${id}`)
        return users
    }
    catch(error){
        console.error(error)
        return false
    }
}

export async function deleteUserID(id: string){
    try{
        const users = await UserModel.findByIdAndDelete(id)
        return users
    }
    catch(error){
        console.error(error)
        return false
    }
}

export const searchByExactSubstring = async (searchTerm: string, userId: string) => {
    try {
        const regex = new RegExp(searchTerm, 'i')
        // Escape special characters in searchTerm for safe regex creation
        const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

         // Find all unique user IDs you have sent or received messages from
        const messagedUserIds = await MessageModel.distinct("senderID", { receiverID: new mongoose.Types.ObjectId(userId) })
        const receivedUserIds = await MessageModel.distinct("receiverID", { senderID: new mongoose.Types.ObjectId(userId) })

        // Combine these IDs into a single set to avoid duplicates
        const excludedUserIds = new Set([...messagedUserIds, ...receivedUserIds]);
        
        // Query the database
        const results = await UserModel.find({ 
            username: { $regex: regex },
            _id: { $nin: Array.from(excludedUserIds) },
        })
  
        return results;
    } catch (error) {
        console.error('Error searching for documents:', error);
        return [];
    }
  };