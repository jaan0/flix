"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiInstagram } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { SiTelegram, SiTiktok } from "react-icons/si";

export default function Footer() {
  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "#plans", label: "All Products" },
    { href: "#features", label: "Blog" },
    { href: "#contact", label: "Contact Us" },
    { href: "#about", label: "About Us" },
  ];

  const socialLinks = [
    {
      icon: FiFacebook,
      href: "https://www.facebook.com/people/Playrix-Sky/pfbid024Lk28ZvFGzJMB21PYGssxRRauaxiE64h7jowk2S5jzFQJqKFHApFyQQaF5jcUimNl/",
      label: "Facebook",
    },
    { icon: SiTelegram, href: "https://t.me/yourchannel", label: "Telegram" },
    {
      icon: FiInstagram,
      href: "https://www.instagram.com/playrixsky/?igsh=MXJoMjVoMWU5OWR1cw%3D%3D#",
      label: "Instagram",
    },
    {
      icon: SiTiktok,
      href: "https://www.tiktok.com/@playrix.sky?_r=1&_t=ZS-910cHR3C1cW",
      label: "TikTok",
    },
  ];

  return (
    <footer className="bg-gray-900 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <HiSparkles className="w-8 h-8 text-purple-500" />
                <div className="absolute inset-0 bg-purple-500 blur-xl opacity-50" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                MyFlix
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Your premium movie streaming platform with world-class quality and unlimited entertainment.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-400 hover:border-purple-500/50 transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+923033996000"
                  className="flex items-center text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <FiPhone className="w-4 h-4 mr-2" />
                  +92-303-3996000
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@playrix.pk"
                  className="flex items-center text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <FiMail className="w-4 h-4 mr-2" />
                  contact@playrix.pk
                </a>
              </li>
              <li className="flex items-start text-gray-400">
                <FiMapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                Pakistan
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 MyFlix. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link
                href="#"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                Legal Notice
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
