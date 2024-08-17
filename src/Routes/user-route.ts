import express from "express"
import { registerLoginController } from "../Controllers/user-controller"

const router = express.Router()

/**
 * @Route POST /login
 * @desc login/register users, no auth really involved
 * @access User
 * @Protected False
 */
router.post('/login', registerLoginController)


/**
 * @Route 
 */




export {router as UserRoute}