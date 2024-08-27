"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIo = SocketIo;
const socket_io_1 = require("socket.io");
const cors_1 = require("../Configs/cors");
function SocketIo(server) {
    const io = new socket_io_1.Server(server, {
        cors: cors_1.corsCustomOption
    });
    return io;
}
