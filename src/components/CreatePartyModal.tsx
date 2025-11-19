"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiUsers, FiLock, FiCopy, FiCheck } from "react-icons/fi";

interface CreatePartyModalProps {
  movieId: string;
  onClose: () => void;
  onSuccess: (partyCode: string) => void;
}

export default function CreatePartyModal({
  movieId,
  onClose,
  onSuccess,
}: CreatePartyModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [partyCode, setPartyCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = `user_${Date.now()}`;
      const res = await fetch("/api/watch-party", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          movieId,
          hostId: userId,
          username: formData.username,
          password: formData.password || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setPartyCode(data.data.partyCode);
        localStorage.setItem("watchPartyUserId", userId);
        localStorage.setItem("watchPartyUsername", formData.username);
      } else {
        alert(data.error || "Failed to create party");
      }
    } catch (error) {
      console.error("Error creating party:", error);
      alert("Error creating party");
    } finally {
      setLoading(false);
    }
  };

  const copyPartyLink = () => {
    const link = `${window.location.origin}/party/${partyCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const joinParty = () => {
    onSuccess(partyCode);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/85 backdrop-blur-xl z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-900 border border-white/10 rounded-2xl max-w-md w-full p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <FiUsers className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                {partyCode ? "Party Created!" : "Create Watch Party"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <FiX className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {!partyCode ? (
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Party Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Movie Night"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Your Username *
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2 flex items-center space-x-2">
                  <FiLock className="w-4 h-4" />
                  <span>Password (Optional)</span>
                </label>
                <input
                  type="password"
                  placeholder="Leave empty for public party"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                {loading ? "Creating..." : "Create Party"}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                <p className="text-sm text-gray-400 mb-2">Party Code</p>
                <p className="text-2xl font-bold text-white mb-4 font-mono">
                  {partyCode}
                </p>
                <p className="text-sm text-gray-400 mb-3">Share this link:</p>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/party/${partyCode}`}
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  />
                  <button
                    onClick={copyPartyLink}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <FiCheck className="w-5 h-5 text-green-400" />
                    ) : (
                      <FiCopy className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={joinParty}
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Start Watch Party
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
