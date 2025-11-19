import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as SocketIOServer } from "socket.io";
import dbConnect from "@/lib/mongodb";
import WatchParty from "@/models/WatchParty";

export type NextApiResponseServerIO = {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log("*First use, starting socket.io");

    const io = new SocketIOServer(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      // Join watch party room
      socket.on("join-party", async ({ partyCode, userId, username }) => {
        socket.join(partyCode);
        console.log(`${username} joined party ${partyCode}`);

        // Broadcast to others in the room
        socket.to(partyCode).emit("user-joined", { userId, username });

        // Send current party state
        try {
          await dbConnect();
          const party = await WatchParty.findOne({ partyCode });
          if (party) {
            socket.emit("party-state", {
              currentTime: party.currentTime,
              isPlaying: party.isPlaying,
              participants: party.participants,
              messages: party.messages.slice(-50), // Last 50 messages
            });
          }
        } catch (error) {
          console.error("Error fetching party state:", error);
        }
      });

      // Leave party
      socket.on("leave-party", ({ partyCode, userId, username }) => {
        socket.leave(partyCode);
        socket.to(partyCode).emit("user-left", { userId, username });
      });

      // Sync video playback
      socket.on("video-play", async ({ partyCode, currentTime }) => {
        try {
          await dbConnect();
          await WatchParty.findOneAndUpdate(
            { partyCode },
            { isPlaying: true, currentTime }
          );
          socket.to(partyCode).emit("video-play", { currentTime });
        } catch (error) {
          console.error("Error updating play state:", error);
        }
      });

      socket.on("video-pause", async ({ partyCode, currentTime }) => {
        try {
          await dbConnect();
          await WatchParty.findOneAndUpdate(
            { partyCode },
            { isPlaying: false, currentTime }
          );
          socket.to(partyCode).emit("video-pause", { currentTime });
        } catch (error) {
          console.error("Error updating pause state:", error);
        }
      });

      socket.on("video-seek", async ({ partyCode, currentTime }) => {
        try {
          await dbConnect();
          await WatchParty.findOneAndUpdate({ partyCode }, { currentTime });
          socket.to(partyCode).emit("video-seek", { currentTime });
        } catch (error) {
          console.error("Error updating seek:", error);
        }
      });

      // Chat messages
      socket.on("send-message", async ({ partyCode, userId, username, message }) => {
        try {
          await dbConnect();
          const party = await WatchParty.findOne({ partyCode });
          if (party) {
            party.messages.push({
              userId,
              username,
              message,
              timestamp: new Date(),
            });
            await party.save();

            io.to(partyCode).emit("new-message", {
              userId,
              username,
              message,
              timestamp: new Date(),
            });
          }
        } catch (error) {
          console.error("Error sending message:", error);
        }
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("Socket.io already running");
  }

  (res as any).status(200).json({ success: true });
};

export default ioHandler;
