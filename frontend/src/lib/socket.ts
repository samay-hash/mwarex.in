import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

let socket: any;

export const getSocket = () => {
    if (!socket) {
        socket = io(SOCKET_URL, {
            withCredentials: true,
            transports: ["websocket", "polling"],
        });
    }
    return socket;
};
