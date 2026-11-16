import express, { Request, Response } from "express";
import http from "http";
import path from "path";
import { Server, Socket } from "socket.io";

interface ChatMessage {
  msg: string;
}

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const users: string[] = [];
const connections: Socket[] = [];

const PORT: number = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/", (req: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

io.sockets.on("connection", (socket: Socket): void => {
  connections.push(socket);
  console.log("Connected: %s sockets connected", connections.length);

  socket.on("disconnect", (): void => {
    const index = connections.indexOf(socket);
    if (index !== -1) {
      connections.splice(index, 1);
    }
    console.log("Disconnected: %s sockets connected", connections.length);
  });

  socket.on("send message", (data: string): void => {
    console.log(data);
    const payload: ChatMessage = { msg: data };
    io.sockets.emit("new message", payload);
  });
});