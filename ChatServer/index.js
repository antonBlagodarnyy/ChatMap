"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const controller_1 = require("./controller");
const url = require("url");
const jwt = require("jsonwebtoken");
const wss = new ws_1.WebSocketServer({ port: 8081 });
// Maps user IDs (sub from JWT) to WebSocket connections
const clients = new Map();
wss.on("connection", function connection(ws, req) {
    console.log("Connected");
    const params = new URLSearchParams(url.parse(req.url).query);
    const token = params.get("token");
    if (!token) {
        console.error("Missing token");
        ws.close();
        return;
    }
    let decoded;
    try {
        //TODO store token secret in .env
        decoded = jwt.verify(token, "my_super_secure_32_characters_key!");
        console.log("Authenticated user:", decoded.sub);
        // Save this user's WebSocket connection
        clients.set(decoded.sub, ws);
        // Store user info on the socket for later use
        ws.user = decoded;
    }
    catch (error) {
        console.error("Invalid JWT: " + error.message);
        ws.close();
        return;
    }
    // Handle incoming messages
    ws.on("message", function message(data) {
        try {
            const parsed = JSON.parse(data.toString());
            const senderId = ws.user.sub;
            const { type, message, recipient } = parsed;
            console.log(`Message from ${senderId} to ${recipient.username}: ${message}`);
            const recipientWs = clients.get(recipient.username);
            //push new message to the db 
            (0, controller_1.insertMessage)(message, senderId, recipient.username);
            if (recipientWs && recipientWs.readyState === ws_1.WebSocket.OPEN) {
                recipientWs.send(JSON.stringify({
                    from: senderId,
                    text: message,
                }));
            }
            else {
                console.warn(`Recipient ${recipient.username} not connected.`);
                // Optionally: queue the message or store it
            }
        }
        catch (err) {
            console.error("Invalid message format", err);
        }
    });
    ws.on("close", () => {
        var _a;
        const userId = (_a = ws.user) === null || _a === void 0 ? void 0 : _a.sub;
        if (userId) {
            clients.delete(userId);
            console.log(`User ${userId} disconnected`);
        }
    });
    // Confirm connection
    ws.send(JSON.stringify("Connected to WebSocket"));
});
