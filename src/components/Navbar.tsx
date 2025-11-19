"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiFilm, FiUser, FiLogOut, FiSettings, FiHeart } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import RequestMovieModal from "./RequestMovieModal";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/movies", label: "Movies" },
    { href: "/browse", label: "Browse" },
    { href: "/my-list", label: "My List" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled
          ? "bg-gray-900/95 backdrop-blur-lg shadow-lg border-b border-purple-500/20"
          : "bg-gradient-to-b from-black/80 via-black/50 to-transparent backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <HiSparkles className="w-8 h-8 text-purple-500 group-hover:text-purple-400 transition-colors" />
              <div className="absolute inset-0 bg-purple-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              MyFlix
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white font-medium hover:text-purple-400 transition-colors relative group drop-shadow-lg"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
            <button
              onClick={() => setShowRequestModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm font-medium transition-all hover:scale-105"
            >
              <FiFilm size={16} />
              <span>Request a Movie</span>
            </button>
            
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm font-medium transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center font-semibold">
                    {(session.user?.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:block">{session.user?.name}</span>
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] rounded-lg shadow-2xl border border-gray-700 overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-gray-700">
                        <p className="text-white font-semibold">{session.user?.name}</p>
                        <p className="text-gray-400 text-sm">{session.user?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/profile"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                        >
                          <FiUser size={18} />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          href="/my-list"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                        >
                          <FiHeart size={18} />
                          <span>My List</span>
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                        >
                          <FiSettings size={18} />
                          <span>Settings</span>
                        </Link>
                      </div>
                      <div className="border-t border-gray-700">
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            signOut();
                          }}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-red-400 transition-colors w-full"
                        >
                          <FiLogOut size={18} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                <FiUser size={18} />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-gray-900/98 backdrop-blur-lg border-t border-purple-500/20"
        >
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-gray-300 hover:text-white transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setShowRequestModal(true);
                setIsOpen(false);
              }}
              className="flex items-center space-x-2 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm font-medium transition-all w-full justify-center"
            >
              <FiFilm size={18} />
              <span>Request a Movie</span>
            </button>
            
            {session ? (
              <div className="space-y-2 border-t border-gray-700 pt-4">
                <div className="px-4 py-2">
                  <p className="text-white font-semibold">{session.user?.name}</p>
                  <p className="text-gray-400 text-sm">{session.user?.email}</p>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <FiUser size={18} />
                  <span>My Profile</span>
                </Link>
                <Link
                  href="/my-list"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <FiHeart size={18} />
                  <span>My List</span>
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-red-400 transition-colors w-full"
                >
                  <FiLogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowAuthModal(true);
                  setIsOpen(false);
                }}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-medium transition-all w-full justify-center"
              >
                <FiUser size={18} />
                <span>Login</span>
              </button>
            )}
          </div>
        </motion.div>
      )}

      <RequestMovieModal isOpen={showRequestModal} onClose={() => setShowRequestModal(false)} />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </motion.nav>
  );
}
