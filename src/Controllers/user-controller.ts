import { Request, Response, NextFunction } from "express";
import { createUser, getUserName } from "../Models/user-model";
import { signToken } from "../Utils/JWTtoken";


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
    
        return res.status(200).json({message: "Cookie set successfuly"})
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

    res.status(200).json({message: "Cookie set successfuly"})
}