"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerLoginController = registerLoginController;
exports.deleteUserController = deleteUserController;
exports.getAllUsersController = getAllUsersController;
const user_model_1 = require("../Models/user-model");
const JWTtoken_1 = require("../Utils/JWTtoken");
function registerLoginController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username } = req.body;
        //check if user exist
        const userExist = yield (0, user_model_1.getUserName)(username);
        if (userExist) {
            const payload = {
                userID: userExist.id,
                user: userExist
            };
            const token = (0, JWTtoken_1.signToken)(payload);
            // res.cookie('authToken', token , {
            //     httpOnly: true,
            //     // secure: true,
            //     sameSite: 'lax' //for development
            // })
            return res.status(200).json({ message: "Cookie set successfuly", user: payload.user, token });
        }
        //if not, create user
        const user = yield (0, user_model_1.createUser)({
            username
        });
        if (!user)
            return res.status(400).json({ success: false, message: "Couldn't create user" });
        //get userId, and username
        const payload = {
            userID: user.id,
            user: user
        };
        const token = (0, JWTtoken_1.signToken)(payload);
        // res.cookie('authToken', token , {
        //     httpOnly: true,
        //     // secure: true,
        //     sameSite: 'lax' //for development
        // })
        res.status(200).json({ message: "Cookie set successfuly", user: payload.user, token });
    });
}
function deleteUserController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userObj = req.user;
            const user = yield (0, user_model_1.deleteUserID)(userObj._id);
            res.status(200).json({ message: "User deleted successfully" });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "failed to delete" });
        }
    });
}
function getAllUsersController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userObj = req.user;
            console.log(`all users controller: ${userObj}`);
            const users = yield (0, user_model_1.getUsers)(userObj._id);
            res.status(200).json({ success: true, data: users });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to get all users" });
        }
    });
}
