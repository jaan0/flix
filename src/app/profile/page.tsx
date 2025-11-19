"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiCalendar, FiEdit2, FiSave, FiX } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
      });
    }
  }, [status, session, router]);

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setIsEditing(false);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update profile" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const user = session.user as any;

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <main className="pt-32 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a1a1a] rounded-lg shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative h-48 bg-gradient-to-r from-purple-600 to-pink-600">
              <div className="absolute -bottom-16 left-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-5xl font-bold border-4 border-[#1a1a1a]">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="pt-20 pb-8 px-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                  <p className="text-gray-400">{user.email}</p>
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-all"
                  >
                    <FiEdit2 size={18} />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-all disabled:opacity-50"
                    >
                      <FiSave size={18} />
                      <span>{loading ? "Saving..." : "Save"}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user.name || "",
                          email: user.email || "",
                        });
                        setMessage({ type: "", text: "" });
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-all"
                    >
                      <FiX size={18} />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              {message.text && (
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    message.type === "success"
                      ? "bg-green-600/20 border border-green-600 text-green-400"
                      : "bg-red-600/20 border border-red-600 text-red-400"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-gray-400 text-sm font-medium">
                    <FiUser size={16} />
                    <span>Full Name</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white">
                      {user.name}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-gray-400 text-sm font-medium">
                    <FiMail size={16} />
                    <span>Email Address</span>
                  </label>
                  <div className="px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-400">
                    {user.email}
                  </div>
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label className="text-gray-400 text-sm font-medium">Account Type</label>
                  <div className="px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === "admin"
                        ? "bg-purple-600/20 text-purple-400"
                        : "bg-blue-600/20 text-blue-400"
                    }`}>
                      {user.role === "admin" ? "Administrator" : "User"}
                    </span>
                  </div>
                </div>

                {/* Member Since */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-gray-400 text-sm font-medium">
                    <FiCalendar size={16} />
                    <span>Member Since</span>
                  </label>
                  <div className="px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white">
                    {new Date().toLocaleDateString("en-US", { 
                      year: "numeric", 
                      month: "long", 
                      day: "numeric" 
                    })}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="bg-[#2a2a2a] rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">0</div>
                  <div className="text-sm text-gray-400 mt-1">Movies Watched</div>
                </div>
                <div className="bg-[#2a2a2a] rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-pink-400">0</div>
                  <div className="text-sm text-gray-400 mt-1">Favorites</div>
                </div>
                <div className="bg-[#2a2a2a] rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">0h</div>
                  <div className="text-sm text-gray-400 mt-1">Watch Time</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
