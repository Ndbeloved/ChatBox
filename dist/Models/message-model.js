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
exports.markMessagesRead = markMessagesRead;
exports.getUnreadCountsBySender = getUnreadCountsBySender;
exports.getCountForUser = getCountForUser;
exports.saveMessage = saveMessage;
const mongoose_1 = __importStar(require("mongoose"));
const messageSchema = new mongoose_1.Schema({
    senderID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    receiverID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    content: {
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
    image: {
        type: String,
    }
});
const MessageModel = mongoose_1.default.model("messages", messageSchema);
function markMessagesRead(senderID, receiverID) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield MessageModel.updateMany({ senderID: receiverID, receiverID: senderID, isRead: false }, { $set: { isRead: true } });
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    });
}
function getUnreadCountsBySender(userID) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const unreadCounts = yield MessageModel.aggregate([
                { $match: {
                        isRead: false,
                        receiverID: new mongoose_1.default.Types.ObjectId(userID)
                    } }, //filtering only unread messages
                { $group: {
                        _id: "$senderID",
                        count: { $sum: 1 }
                    } }, //group by senderID and count unread messages
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
            ]);
            const results = unreadCounts.reduce((acc, curr) => {
                acc[curr.senderName] = curr.count;
                return acc;
            }, {});
            return results;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    });
}
function getCountForUser(userID) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const count = yield MessageModel.countDocuments({ receiverID: userID, isRead: false });
            return count;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    });
}
function saveMessage(senderID, receiverID, content, replied, image) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = new MessageModel({
            senderID,
            receiverID,
            content,
            replied,
            image
        });
        yield message.save();
    });
}
