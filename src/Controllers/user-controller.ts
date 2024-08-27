import { Request, Response, NextFunction } from "express";
import { createUser, deleteUserID, getUserName, getUsers } from "../Models/user-model";
import { signToken } from "../Utils/JWTtoken";

interface CustomRequest extends Request{
    user?: any
}


export async function registerLoginController(req: Request, res: Response, next: NextFunction){

    const { username } = req.body

    //check if user exist
    const userExist = await getUserName(username)

    if(userExist){
        const payload = {
            userID: userExist.id,
            user: userExist
        }

        const token =  signToken(payload)

        res.cookie('authToken', token , {
            httpOnly: true,
            // domain: process.env.SITE_URL,
            secure: false,
            sameSite: 'lax' //for development
        })
    
        return res.status(200).json({message: "Cookie set successfuly", user: payload.user})
    }

    //if not, create user
    const user = await createUser({
        username
    })
    
    if(!user) return res.status(400).json({success: false, message: "Couldn't create user"})

    //get userId, and username
    const payload = {
        userID: user.id as string,
        user: user
    }

    const token = signToken(payload)
    res.cookie('authToken', token , {
        httpOnly: true,
        // domain: process.env.SITE_URL,
        secure: false,
        sameSite: 'lax' //for development
    })

    res.status(200).json({message: "Cookie set successfuly", user: payload.user})
}


export async function deleteUserController(req: CustomRequest, res: Response, next: NextFunction){
    try{
        const userObj = req.user
        const user = await deleteUserID(userObj._id)
        res.status(200).json({message: "User deleted successfully"})
    }
    catch(error){
        console.error(error)
        res.status(500).json({success: false, message: "failed to delete"})
    }
}

export async function getAllUsersController(req: CustomRequest, res: Response, next: NextFunction){
    try{
        const userObj = req.user
        const users = await getUsers(userObj._id)
        res.status(200).json({success: true, data: users})
    }
    catch(error){
        console.error(error)
        res.status(500).json({message: "Failed to get all users"})
    }
}