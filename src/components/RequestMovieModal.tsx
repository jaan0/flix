"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

interface RequestMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestMovieModal({ isOpen, onClose }: RequestMovieModalProps) {
  const [formData, setFormData] = useState({
    movieTitle: "",
    releaseYear: "",
    directorActors: "",
    userName: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/movie-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          releaseYear: formData.releaseYear ? parseInt(formData.releaseYear) : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setFormData({
            movieTitle: "",
            releaseYear: "",
            directorActors: "",
            userName: "",
          });
        }, 2000);
      } else {
        setError(data.error || "Failed to submit request");
      }
    } catch (error) {
      console.error("Error submitting movie request:", error);
      setError("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#141414] rounded-lg max-w-lg w-full p-8 relative shadow-2xl top-90"
            style={{ zIndex: 10000 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>

            <h1 className="text-2xl font-bold text-white mb-2">Request a Movie</h1>
            <p className="text-gray-400 text-sm mb-6">Let us know what you'd like to watch</p>

            {success && (
              <div className="mb-4 p-3 bg-green-600/20 border border-green-600 text-green-400 text-sm rounded">
                Request Submitted! We'll review your request soon.
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-600/20 border border-red-600 text-red-400 text-sm rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                required
                value={formData.movieTitle}
                onChange={(e) => setFormData({ ...formData, movieTitle: e.target.value })}
                placeholder="Movie Title *"
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />

              <input
                type="number"
                min="1900"
                max={new Date().getFullYear() + 5}
                value={formData.releaseYear}
                onChange={(e) => setFormData({ ...formData, releaseYear: e.target.value })}
                placeholder="Release Year (Optional)"
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />

              <input
                type="text"
                value={formData.directorActors}
                onChange={(e) => setFormData({ ...formData, directorActors: e.target.value })}
                placeholder="Director/Actors (Optional)"
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />

              <input
                type="text"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                placeholder="Your Name (Optional)"
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />

              <button
                type="submit"
                disabled={loading || success}
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-purple-500/50"
              >
                {loading ? "Submitting..." : success ? "Submitted!" : "Submit Request"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
