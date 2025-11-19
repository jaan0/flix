"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import VideoPlayer from "@/components/VideoPlayer";
import { FiArrowLeft, FiSend, FiUsers } from "react-icons/fi";
import Link from "next/link";

export default function WatchPartyPage() {
  const params = useParams();
  const router = useRouter();
  const partyCode = (params?.code as string) || "";
  
  const [movie, setMovie] = useState<any>(null);
  const [party, setParty] = useState<any>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [participants, setParticipants] = useState<any[]>([]);
  const [password, setPassword] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const playerRef = useRef<any>(null);
  const isHost = useRef(false);

  useEffect(() => {
    fetchPartyInfo();
    initSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const initSocket = async () => {
    await fetch("/api/socket");
    const newSocket = io({
      path: "/api/socket",
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket");
    });

    newSocket.on("party-state", (state) => {
      setParticipants(state.participants);
      setMessages(state.messages);
      
      if (playerRef.current) {
        playerRef.current.currentTime(state.currentTime);
        if (state.isPlaying) {
          playerRef.current.play();
        } else {
          playerRef.current.pause();
        }
      }
    });

    newSocket.on("user-joined", ({ username }) => {
      addSystemMessage(`${username} joined the party`);
    });

    newSocket.on("user-left", ({ username }) => {
      addSystemMessage(`${username} left the party`);
    });

    newSocket.on("video-play", ({ currentTime }) => {
      if (playerRef.current) {
        playerRef.current.currentTime(currentTime);
        playerRef.current.play();
      }
    });

    newSocket.on("video-pause", ({ currentTime }) => {
      if (playerRef.current) {
        playerRef.current.currentTime(currentTime);
        playerRef.current.pause();
      }
    });

    newSocket.on("video-seek", ({ currentTime }) => {
      if (playerRef.current) {
        playerRef.current.currentTime(currentTime);
      }
    });

    newSocket.on("new-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    setSocket(newSocket);
  };

  const fetchPartyInfo = async () => {
    try {
      const res = await fetch(`/api/watch-party/${partyCode}`);
      const data = await res.json();

      if (!data.success) {
        alert("Party not found");
        router.push("/");
        return;
      }

      if (data.data.hasPassword) {
        setNeedsPassword(true);
        setLoading(false);
        return;
      }

      await joinParty();
    } catch (error) {
      console.error("Error fetching party:", error);
      setLoading(false);
    }
  };

  const joinParty = async () => {
    try {
      const userId = localStorage.getItem("watchPartyUserId") || `user_${Date.now()}`;
      const username = localStorage.getItem("watchPartyUsername") || "Anonymous";

      const res = await fetch(`/api/watch-party/${partyCode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, username, password }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Failed to join party");
        return;
      }

      setParty(data.data);
      
      // Fetch movie details
      const movieRes = await fetch(`/api/movies/${data.data.movieId}`);
      const movieData = await movieRes.json();
      if (movieData.success) {
        setMovie(movieData.data);
      }

      // Join socket room
      if (socket) {
        socket.emit("join-party", { partyCode, userId, username });
      }

      setNeedsPassword(false);
      setLoading(false);
    } catch (error) {
      console.error("Error joining party:", error);
      alert("Error joining party");
    }
  };

  const addSystemMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        userId: "system",
        username: "System",
        message: text,
        timestamp: new Date(),
      },
    ]);
  };

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;

    player.on("play", () => {
      if (socket && !isHost.current) {
        return;
      }
      const currentTime = player.currentTime();
      socket?.emit("video-play", { partyCode, currentTime });
    });

    player.on("pause", () => {
      if (socket && !isHost.current) {
        return;
      }
      const currentTime = player.currentTime();
      socket?.emit("video-pause", { partyCode, currentTime });
    });

    player.on("seeked", () => {
      if (socket && !isHost.current) {
        return;
      }
      const currentTime = player.currentTime();
      socket?.emit("video-seek", { partyCode, currentTime });
    });
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !socket) return;

    const userId = localStorage.getItem("watchPartyUserId") || `user_${Date.now()}`;
    const username = localStorage.getItem("watchPartyUsername") || "Anonymous";

    socket.emit("send-message", {
      partyCode,
      userId,
      username,
      message: messageInput.trim(),
    });

    setMessageInput("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading party...</div>
      </div>
    );
  }

  if (needsPassword) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-6">
            Party Password Required
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              joinParty();
            }}
            className="space-y-4"
          >
            <input
              type="password"
              placeholder="Enter party password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
              required
            />
            <button
              type="submit"
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              Join Party
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading movie...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link
            href={`/movie/${movie._id}`}
            className="flex items-center space-x-2 text-white hover:text-purple-400 transition-colors"
          >
            <FiArrowLeft className="w-6 h-6" />
            <span className="font-semibold">Leave Party</span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white">
              <FiUsers className="w-5 h-5" />
              <span>{participants.length}</span>
            </div>
            <h1 className="text-white font-bold text-xl">{party?.name}</h1>
          </div>
          <div className="w-32"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-screen pt-20">
        {/* Video Player */}
        <div className="flex-1 bg-black">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="w-full aspect-video">
              <VideoPlayer
                src={movie.videoUrl}
                poster={movie.posterUrl}
                onReady={handlePlayerReady}
              />
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-80 bg-gray-900 border-l border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-white font-semibold">Chat</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`${
                  msg.userId === "system"
                    ? "text-center text-gray-500 text-sm italic"
                    : ""
                }`}
              >
                {msg.userId !== "system" && (
                  <div className="flex flex-col">
                    <span className="text-xs text-purple-400 font-semibold">
                      {msg.username}
                    </span>
                    <span className="text-white text-sm">{msg.message}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                )}
                {msg.userId === "system" && msg.message}
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="p-4 border-t border-white/10">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
              />
              <button
                type="submit"
                className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                <FiSend className="w-5 h-5 text-white" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
