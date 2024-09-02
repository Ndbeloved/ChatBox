"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.searchByExactSubstring = void 0;
exports.createUser = createUser;
exports.getUserID = getUserID;
exports.getUserName = getUserName;
exports.getUsers = getUsers;
exports.deleteUserID = deleteUserID;
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    }
}, { timestamps: true });
const UserModel = mongoose_1.default.model("users", UserSchema);
function createUser(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username } = payload;
            const user = yield UserModel.create({
                username
            });
            return user;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    });
}
function getUserID(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (id) {
                const user = yield UserModel.findById(id);
                return user;
            }
            else {
                console.error("No Username or Id parsed to getUser");
                return false;
            }
        }
        catch (error) {
            console.error(error);
            return false;
        }
    });
}
function getUserName(username) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (username) {
                const user = yield UserModel.findOne({ username: username });
                return user;
            }
            else {
                console.error("No Username or Id parsed to getUser");
                return false;
            }
        }
        catch (error) {
            console.error(error);
            return false;
        }
    });
}
function getUsers(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield UserModel.find({ _id: { $ne: id } });
            console.log(`id: ${id}`);
            return users;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    });
}
function deleteUserID(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield UserModel.findByIdAndDelete(id);
            return users;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    });
}
const searchByExactSubstring = (searchTerm) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const regex = new RegExp(`\\b${searchTerm}\\b`, 'i');
        // Query the database
        const results = yield UserModel.find({ username: { $regex: regex } });
        console.log(results);
        return results;
    }
    catch (error) {
        console.error('Error searching for documents:', error);
        return [];
    }
});
exports.searchByExactSubstring = searchByExactSubstring;
