import cookie from "cookie";
import { secret } from "./controllers/main.js";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { set } from "mongoose";
function setupSocketIO(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.use((socket, next) => {
        const cookies = socket.request.headers.cookie;
        if (cookies) {
            const parsedCookies = cookie.parse(cookies);
            const token = parsedCookies.auth;
            if (!token) {
                console.log("No auth token found in cookies");
                return next(new Error("Authentication error"));
            }
            else {
                jwt.verify(token, secret, (err, decoded) => {
                    if (err) {
                        console.log("Invalid token:", err.message);
                        throw new Error("Authentication error");
                    }
                    socket.user = decoded;
                    const expirationTime = decoded.exp * 1000;
                    const currentTime = Date.now();
                    if (currentTime > expirationTime) {
                        console.log("Token has expired");
                        return next(new Error("Authentication error"));
                    }
                    else{
                        const timeleft = expirationTime - currentTime;
                        console.log("Token is valid, time left:", timeleft, "ms");
                        setTimeout(() => {
                            console.log("Token expired, disconnecting socket:", socket.id);
                            socket.disconnect(true);
                        }
                        , timeleft);
                    }
                    console.log("User authenticated:", socket.user);
                    ///missing timeout
                });
            }
        } else {
            console.log("No cookies found");
            return next(new Error("Authentication error"));
        }
        next();
    });

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });

    return io;
}
export default setupSocketIO;