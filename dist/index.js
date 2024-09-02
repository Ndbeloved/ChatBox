"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_1 = require("./Services/socket");
const socket_controller_1 = require("./Services/socket-controller");
const io_middleware_1 = require("./Middleware/io-middleware");
const mongoose_1 = __importDefault(require("mongoose"));
const user_route_1 = require("./Routes/user-route");
// import https from "https"
// import fs from "fs"
dotenv_1.default.config();
const app = (0, express_1.default)();
// app.use(express.static(__dirname))
// const key = fs.readFileSync("cert.key")
// const cert = fs.readFileSync("cert.crt")
const server = http_1.default.createServer(app);
// const server = https.createServer({key, cert}, app)
const PORT = process.env.PORT || 3000;
const dbURL = process.env.MONGO_URL || 'null';
//setting up server with socket.io
const io = (0, socket_1.SocketIo)(server);
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.SITE_URL,
}));
app.use(body_parser_1.default.json({ limit: "1mb" }));
//middleware to prevent CSWSH and authenticate connections
io.use(io_middleware_1.sameOrigin);
io.use(io_middleware_1.authenticate);
//Socket io controllers
(0, socket_controller_1.SocketController)(io);
//routes
app.use("/auth/user", user_route_1.UserRoute);
app.get('/', (req, res) => {
    const authToken = req.cookies['authToken'];
    res.status(200).json({ message: "getting cookies" });
});
app.use((req, res, next) => {
    res.status(404).json({ message: "Page not found" });
});
mongoose_1.default.connect(dbURL)
    .then(() => {
    console.log("connected to mongodb...");
    server.listen(PORT, () => {
        console.log("server is running");
    });
})
    .catch(err => {
    console.error("failed to connect to db: ", err);
});
