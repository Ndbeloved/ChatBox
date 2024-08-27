import express from "express"
import { deleteUserController, getAllUsersController, registerLoginController } from "../Controllers/user-controller"
import { isAuthenticated } from "../Middleware/auth-middleware"

const router = express.Router()

/**
 * @Route POST /login
 * @desc login/register users, no auth really involved
 * @access User
 * @Protected False
 */
router.post('/login', registerLoginController)

router.get('/allusers', isAuthenticated, getAllUsersController)

router.post('/delete', isAuthenticated, deleteUserController)


/**
 * @Route 
 */




export {router as UserRoute}