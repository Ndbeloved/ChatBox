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
exports.SocketController = SocketController;
const message_model_1 = require("../Models/message-model");
function SocketController(io) {
    io.on("connection", (socket) => __awaiter(this, void 0, void 0, function* () {
        console.log(`New user ${socket.id} connected...`);
        //get userID
        const { userID, user } = socket.data.user;
        //join your chat
        socket.join(userID);
        io.to(userID).emit("messageCount", { unread: yield (0, message_model_1.getUnreadCountsBySender)(userID) });
        socket.on("privateMessage", (data) => __awaiter(this, void 0, void 0, function* () {
            const { recipientID, message, replied, image, sender, read } = data;
            io.to(recipientID).emit('privateMessage', data);
            //save message to db
            yield (0, message_model_1.saveMessage)(sender, recipientID, message, replied, image);
            //Notify receiver with the new message and updated count
            io.to(recipientID).emit("messageCount", { unread: yield (0, message_model_1.getUnreadCountsBySender)(recipientID) });
        }));
        socket.on("markAsRead", (data) => __awaiter(this, void 0, void 0, function* () {
            const { receiverID, senderID } = data;
            if (receiverID && senderID) {
                console.log("read by: ", senderID);
                yield (0, message_model_1.markMessagesRead)(senderID, receiverID);
                io.to(userID).emit("messageCount", { unread: yield (0, message_model_1.getUnreadCountsBySender)(userID) });
            }
        }));
        socket.on("disconnect", () => {
            console.log(`User ${socket.id} left the connection...`);
        });
    }));
}
