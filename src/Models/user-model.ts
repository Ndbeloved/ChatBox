import mongoose, { Schema } from "mongoose"
import { ICreateUserPayload } from "../Interface/user-model-interface"


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

export async function getUsers(){
    try{
        const users = await UserModel.find()
        return users
    }
    catch(error){
        console.error(error)
        return false
    }
}