"use client";

import { motion } from "framer-motion";
import { HiSparkles } from "react-icons/hi2";

export default function ComingSoonBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 backdrop-blur-sm p-12 text-center">
          {/* Animated Background */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"
          />

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-6"
            >
              <HiSparkles className="w-5 h-5 text-purple-400" />
              <span className="text-purple-300 font-semibold">Coming Soon</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                TV Shows Are On Their Way!
              </span>
            </h2>

            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              We're currently building an amazing collection of TV shows and series. 
              Stay tuned for binge-worthy content coming your way soon!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
                <span className="text-gray-400 text-sm">Currently Available:</span>
                <span className="ml-2 text-white font-semibold">Movies Only</span>
              </div>
              <div className="px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full">
                <span className="text-gray-300 text-sm">Coming Soon:</span>
                <span className="ml-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent font-semibold">
                  TV Shows & Series
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
