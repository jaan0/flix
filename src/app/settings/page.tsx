"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiLock, FiMail, FiUser, FiBell, FiEye, FiEyeOff, FiSave, FiShield } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("account");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    newMovies: true,
    movieRequests: false,
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    showWatchHistory: true,
    showFavorites: true,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to change password" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSave = async () => {
    setMessage({ type: "", text: "" });
    setLoading(true);
    
    try {
      const response = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notifications }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "Notification preferences saved!" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save preferences" });
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

  const tabs = [
    { id: "account", label: "Account", icon: FiUser },
    { id: "security", label: "Security", icon: FiShield },
    { id: "notifications", label: "Notifications", icon: FiBell },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <main className="pt-32 pb-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-white mb-8">Settings</h1>

            <div className="grid lg:grid-cols-4 gap-6">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-[#1a1a1a] rounded-lg p-2 space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setMessage({ type: "", text: "" });
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                          activeTab === tab.id
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <Icon size={20} />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-3">
                <div className="bg-[#1a1a1a] rounded-lg p-6">
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

                  {/* Account Tab */}
                  {activeTab === "account" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-4">Account Information</h2>
                        <p className="text-gray-400 mb-6">Manage your account details</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="flex items-center space-x-2 text-gray-400 text-sm font-medium mb-2">
                            <FiUser size={16} />
                            <span>Full Name</span>
                          </label>
                          <div className="px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white">
                            {session.user?.name}
                          </div>
                        </div>

                        <div>
                          <label className="flex items-center space-x-2 text-gray-400 text-sm font-medium mb-2">
                            <FiMail size={16} />
                            <span>Email Address</span>
                          </label>
                          <div className="px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white">
                            {session.user?.email}
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            To change your email, please contact support
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Tab */}
                  {activeTab === "security" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-4">Security Settings</h2>
                        <p className="text-gray-400 mb-6">Manage your password and security preferences</p>
                      </div>

                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                          <label className="flex items-center space-x-2 text-gray-400 text-sm font-medium mb-2">
                            <FiLock size={16} />
                            <span>Current Password</span>
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.current ? "text" : "password"}
                              value={passwordForm.currentPassword}
                              onChange={(e) =>
                                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                              }
                              required
                              className="w-full px-4 py-3 pr-12 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                              placeholder="Enter current password"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              {showPasswords.current ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="flex items-center space-x-2 text-gray-400 text-sm font-medium mb-2">
                            <FiLock size={16} />
                            <span>New Password</span>
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.new ? "text" : "password"}
                              value={passwordForm.newPassword}
                              onChange={(e) =>
                                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                              }
                              required
                              className="w-full px-4 py-3 pr-12 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowPasswords({ ...showPasswords, new: !showPasswords.new })
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              {showPasswords.new ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="flex items-center space-x-2 text-gray-400 text-sm font-medium mb-2">
                            <FiLock size={16} />
                            <span>Confirm New Password</span>
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.confirm ? "text" : "password"}
                              value={passwordForm.confirmPassword}
                              onChange={(e) =>
                                setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                              }
                              required
                              className="w-full px-4 py-3 pr-12 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                              placeholder="Confirm new password"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              {showPasswords.confirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </button>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiSave size={18} />
                          <span>{loading ? "Changing..." : "Change Password"}</span>
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Notifications Tab */}
                  {activeTab === "notifications" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-4">Notification Preferences</h2>
                        <p className="text-gray-400 mb-6">Choose what updates you want to receive</p>
                      </div>

                      <div className="space-y-4">
                        <label className="flex items-center justify-between p-4 bg-[#2a2a2a] border border-gray-700 rounded-lg cursor-pointer hover:bg-[#333] transition-colors">
                          <div className="flex-1">
                            <div className="text-white font-medium mb-1">Email Updates</div>
                            <div className="text-sm text-gray-400">
                              Receive updates about new features and improvements
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.emailUpdates}
                            onChange={(e) =>
                              setNotifications({ ...notifications, emailUpdates: e.target.checked })
                            }
                            className="w-5 h-5 rounded accent-purple-600 cursor-pointer"
                          />
                        </label>

                        <label className="flex items-center justify-between p-4 bg-[#2a2a2a] border border-gray-700 rounded-lg cursor-pointer hover:bg-[#333] transition-colors">
                          <div className="flex-1">
                            <div className="text-white font-medium mb-1">New Movies</div>
                            <div className="text-sm text-gray-400">
                              Get notified when new movies are added
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.newMovies}
                            onChange={(e) =>
                              setNotifications({ ...notifications, newMovies: e.target.checked })
                            }
                            className="w-5 h-5 rounded accent-purple-600 cursor-pointer"
                          />
                        </label>

                        <label className="flex items-center justify-between p-4 bg-[#2a2a2a] border border-gray-700 rounded-lg cursor-pointer hover:bg-[#333] transition-colors">
                          <div className="flex-1">
                            <div className="text-white font-medium mb-1">Movie Request Updates</div>
                            <div className="text-sm text-gray-400">
                              Get updates on your movie requests
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.movieRequests}
                            onChange={(e) =>
                              setNotifications({ ...notifications, movieRequests: e.target.checked })
                            }
                            className="w-5 h-5 rounded accent-purple-600 cursor-pointer"
                          />
                        </label>
                      </div>

                      <button
                        onClick={handleNotificationSave}
                        disabled={loading}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiSave size={18} />
                        <span>{loading ? "Saving..." : "Save Preferences"}</span>
                      </button>
                    </div>
                  )}
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
