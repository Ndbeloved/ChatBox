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
const user_model_1 = require("../Models/user-model");
//offers will contain {}
const offers = [];
const connectedSockets = [
//username, socketId
];
function SocketController(io) {
    io.on("connection", (socket) => __awaiter(this, void 0, void 0, function* () {
        console.log(`New user ${socket.id} connected...`);
        //get userID
        const { userID, user } = socket.data.user;
        const userName = user.username;
        connectedSockets.push({
            socketId: socket.id,
            userName: user._id
        });
        io.emit("newUser", connectedSockets);
        console.log("sockets connected: ", connectedSockets);
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
            io.to(userID).emit("messageCount", { unread: yield (0, message_model_1.getUnreadCountsBySender)(userID) });
        }));
        socket.on("markAsRead", (data) => __awaiter(this, void 0, void 0, function* () {
            const { receiverID, senderID } = data;
            if (receiverID && senderID) {
                yield (0, message_model_1.markMessagesRead)(senderID, receiverID);
                io.to(userID).emit("messageCount", { unread: yield (0, message_model_1.getUnreadCountsBySender)(userID) });
            }
        }));
        socket.on("search", (data) => __awaiter(this, void 0, void 0, function* () {
            const { searchTerm } = data;
            const results = yield (0, user_model_1.searchByExactSubstring)(searchTerm, userID);
            io.to(userID).emit("searchResult", results);
        }));
        //////////////////////////////////////Video calls////////////////////////////////////////
        //a new client has joined. If there are any offers available,
        //emit them out
        if (offers.length) {
            socket.emit('availableOffers', offers);
        }
        socket.on('newOffer', (data) => {
            const { recipientID, newOffer } = data;
            offers.push({
                offererUserName: userID,
                offer: newOffer,
                offerIceCandidates: [],
                answererUserName: null,
                answer: null,
                answererIceCandidates: []
            });
            // console.log(newOffer.sdp.slice(50))
            //send out to all connected sockets EXCEPT the caller
            io.to(recipientID).emit('newOfferAwaiting', offers.slice(-1));
        });
        socket.on('newAnswer', (offerObj, ackFunction) => {
            // console.log(offerObj);
            //emit this answer (offerObj) back to CLIENT1
            //in order to do that, we need CLIENT1's socketid
            const socketToAnswer = connectedSockets.find(s => s.userName === offerObj.offererUserName);
            if (!socketToAnswer) {
                console.log("No matching socket");
                return;
            }
            //we found the matching socket, so we can emit to it!
            const socketIdToAnswer = socketToAnswer.socketId;
            console.log("socketToAnswer: ", socketIdToAnswer, "offererUSername: ", offerObj.offererUserName);
            //we find the offer to update so we can emit it
            const offerToUpdate = offers.find(o => o.offererUserName === offerObj.offererUserName);
            if (!offerToUpdate) {
                console.log("No OfferToUpdate");
                return;
            }
            //send back to the answerer all the iceCandidates we have already collected
            ackFunction(offerToUpdate.offerIceCandidates);
            offerToUpdate.answer = offerObj.answer;
            offerToUpdate.answererUserName = userID;
            //socket has a .to() which allows emiting to a "room"
            //every socket has it's own room
            socket.to(socketIdToAnswer).emit('answerResponse', offerToUpdate);
        });
        socket.on('sendIceCandidateToSignalingServer', iceCandidateObj => {
            const { didIOffer, iceUserName, iceCandidate } = iceCandidateObj;
            // console.log(iceCandidate);
            if (didIOffer) {
                //this ice is coming from the offerer. Send to the answerer
                const offerInOffers = offers.find(o => o.offererUserName === iceUserName);
                if (offerInOffers) {
                    offerInOffers.offerIceCandidates.push(iceCandidate);
                    // 1. When the answerer answers, all existing ice candidates are sent
                    // 2. Any candidates that come in after the offer has been answered, will be passed through
                    if (offerInOffers.answererUserName) {
                        //pass it through to the other socket
                        const socketToSendTo = connectedSockets.find(s => s.userName === offerInOffers.answererUserName);
                        if (socketToSendTo) {
                            socket.to(socketToSendTo.socketId).emit('receivedIceCandidateFromServer', iceCandidate);
                        }
                        else {
                            console.log("Ice candidate recieved but could not find answere");
                        }
                    }
                }
            }
            else {
                //this ice is coming from the answerer. Send to the offerer
                //pass it through to the other socket
                console.log("ice name: ", iceUserName);
                const offerInOffers = offers.find(o => o.answererUserName === iceUserName);
                const socketToSendTo = connectedSockets.find(s => s.userName === (offerInOffers === null || offerInOffers === void 0 ? void 0 : offerInOffers.offererUserName));
                if (socketToSendTo) {
                    socket.to(socketToSendTo.socketId).emit('receivedIceCandidateFromServer', iceCandidate);
                }
                else {
                    console.log("Ice candidate recieved but could not find offerer");
                }
            }
            // console.log(offers)
        });
        socket.on("callEnded", (data) => {
            const { offerUsername, feedbackID } = data;
            console.log("offerUsername endCall: ", offerUsername);
            console.log("feedbackID endCall: ", feedbackID);
            const answerer = offerUsername === feedbackID ? true : false;
            const index = offers.findIndex(offer => offer.offererUserName === offerUsername);
            if (index !== -1) {
                offers.splice(index, 1);
            }
            io.to(feedbackID).emit("callEnd", { answerer });
        });
        socket.on("disconnect", () => {
            console.log(`User ${socket.id} left the connection...`);
            io.emit("userLeft", userID);
            connectedSockets.map(s => {
                const connection = connectedSockets.find(s => s.socketId === socket.id);
                const offerName = connection === null || connection === void 0 ? void 0 : connection.userName;
                const index = offers.findIndex(offer => offer.offererUserName === offerName);
                if (index !== -1) {
                    offers.splice(index, 1);
                    console.log("cleaned up offer");
                }
            });
            const index = connectedSockets.findIndex(s => s.socketId === socket.id);
            if (index !== -1) {
                connectedSockets.splice(index, 1);
                console.log("cleaned up connected sockets");
            }
        });
    }));
}
