import { Server, Socket } from "socket.io";

interface SignalPayload {
    userToSignal: string;
    callerID: string;
    signal: any;
}

interface ReturnSignalPayload {
    callerID: string;
    signal: any;
}

export const initializeSocket = (io: Server): void => {
    io.on("connection", (socket: Socket) => {
        socket.on("join room", (roomId: string) => {
            const otherUsers = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
                .filter((id) => id !== socket.id);
            socket.join(roomId);
            socket.emit("all users", otherUsers);
        });

        socket.on("sending signal", (payload: SignalPayload) => {
            io.to(payload.userToSignal).emit("user joined", {
                signal: payload.signal,
                callerID: payload.callerID,
            })
        });

        socket.on("return signal", (payload: ReturnSignalPayload) => {
            io.to(payload.callerID).emit("receiving returned signal", {
                signal: payload.signal,
                id: socket.id,
            })
        });

        socket.on("disconnect", () => {
            io.emit("user left", socket.id);
        });
    });
}