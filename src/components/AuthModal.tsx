"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        setSuccess("Sign in successful!");
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create account");
      } else {
        setSuccess("Account created! Signing you in...");
        
        setTimeout(async () => {
          const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
          });

          if (!result?.error) {
            onClose();
            window.location.reload();
          }
        }, 1000);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    resetForm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-[10000] flex items-center justify-center p-4"
          style={{ position: "fixed", top: 0, left: 0, zIndex: 10000 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1a1a1a] rounded-lg max-w-md w-full p-8 relative shadow-2xl top-90"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
              <FiX className="w-6 h-6" />
            </button>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-700">
              <button
                onClick={() => {
                  setMode("signin");
                  resetForm();
                }}
                className={`pb-3 px-2 font-semibold text-lg transition-all relative ${
                  mode === "signin"
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Sign In
                {mode === "signin" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"
                  />
                )}
              </button>
              <button
                onClick={() => {
                  setMode("signup");
                  resetForm();
                }}
                className={`pb-3 px-2 font-semibold text-lg transition-all relative ${
                  mode === "signup"
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Sign Up
                {mode === "signup" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"
                  />
                )}
              </button>
            </div>

            {success && (
              <div className="mb-4 p-3 bg-green-600/20 border border-green-600 text-green-400 text-sm rounded">
                {success}
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-600/20 border border-red-600 text-red-400 text-sm rounded">
                {error}
              </div>
            )}

            <form
              onSubmit={mode === "signin" ? handleSignIn : handleSignUp}
              className="space-y-5"
            >
              {mode === "signup" && (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Full Name"
                  className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              )}

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />

              {mode === "signup" && (
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-purple-500/50"
              >
                {loading
                  ? mode === "signin"
                    ? "Signing in..."
                    : "Creating account..."
                  : mode === "signin"
                  ? "Sign In"
                  : "Sign Up"}
              </button>
            </form>

            {mode === "signin" && (
              <div className="mt-4 text-center">
                <button className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            <div className="mt-6 text-center text-sm text-gray-400">
              {mode === "signin" ? (
                <>
                  New to MyFlix?{" "}
                  <button
                    onClick={() => {
                      setMode("signup");
                      resetForm();
                    }}
                    className="text-white hover:text-purple-400 font-semibold transition-colors"
                  >
                    Sign up now
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setMode("signin");
                      resetForm();
                    }}
                    className="text-white hover:text-purple-400 font-semibold transition-colors"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
