import { timeStamp } from "node:console";
import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8000 });

interface ChatMessage {
  sender: string | null;
  text: string;
  timestamp: number;
}

interface ChatRoom {
  participants: Set<WebSocket>;
  messages: ChatMessage[];
}

export const activeChats = new Map<string, ChatRoom>();

wss.on("connection", (ws: WebSocket) => {
  let userRoom: string | null = null;
  let userId: string | null = null;

  ws.on("message", (messageBuffer) => {
    try {
      const data = JSON.parse(messageBuffer.toString());

      switch (data.type) {
        case "JOIN_CHAT":
          userRoom = data.room;
          userId = data.userId;

          if (!userRoom) return;

          if (!activeChats.has(userRoom)) {
            activeChats.set(userRoom, {
              participants: new Set<WebSocket>(),
              messages: [],
            });
          }

          activeChats.get(userRoom)?.participants.add(ws);

          const roomHistory = activeChats.get(userRoom)?.messages || [];
          ws.send(JSON.stringify({ type: "HISTORY", data: roomHistory }));
          break;

        case "SEND_MESSAGE":
          if (userRoom && activeChats.has(userRoom)) {
            const room = activeChats.get(userRoom);
            if (!room) return;

            const newMessage: ChatMessage = {
              sender: userId,
              text: data.text,
              timestamp: Date.now(),
            };

            room.messages.push(newMessage);

            const payload = JSON.stringify({
              type: "NEW_MESSAGE",
              data: newMessage,
            });

            room.participants.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) client.send(payload);
            });
          }
          break;
      }
    } catch (error) {
      console.error("Failed to process message:", error);
    }
  });

  ws.on("close", () => {
    if (userRoom && activeChats.has(userRoom)) {
      const roomData = activeChats.get(userRoom);

      if (roomData) {
        roomData.participants.delete(ws);

        if (roomData.participants.size === 0) {
          activeChats.delete(userRoom);
          console.log(`Room ${userRoom} deleted due to disconnection.`);
        }
      }
    }
  });
});

console.log("Websocket server running on port 8000");
