"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../Controllers/user-controller");
const auth_middleware_1 = require("../Middleware/auth-middleware");
const router = express_1.default.Router();
exports.UserRoute = router;
/**
 * @Route POST /login
 * @desc login/register users, no auth really involved
 * @access User
 * @Protected False
 */
router.post('/login', user_controller_1.registerLoginController);
router.get('/allusers', auth_middleware_1.isAuthenticated, user_controller_1.getAllUsersController);
router.post('/delete', auth_middleware_1.isAuthenticated, user_controller_1.deleteUserController);
