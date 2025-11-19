"use client";

import { motion } from "framer-motion";
import { FiPlay, FiInfo } from "react-icons/fi";
import Link from "next/link";

interface MovieHeroProps {
  movie: any;
}

export default function MovieHero({ movie }: MovieHeroProps) {
  if (!movie) {
    return (
      <div className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <div className="text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Welcome to MyFlix
          </h1>
          <p className="text-xl text-gray-400 mt-4">Your premium streaming platform</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden z-[1]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={movie.posterUrl || movie.thumbnailUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg">
              {movie.title}
            </h1>

            {/* Meta Info */}
            <div className="flex items-center space-x-4 mb-6 text-sm">
              <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold">
                {movie.rating}/10
              </span>
              <span className="text-gray-300">{movie.year}</span>
              <span className="text-gray-300">{movie.duration} min</span>
              <span className="px-3 py-1 border border-purple-500/50 rounded-full text-purple-300">
                {movie.quality}
              </span>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-300 mb-8 line-clamp-3">
              {movie.description}
            </p>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-8">
              {movie.genre.map((g: string) => (
                <span
                  key={g}
                  className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-gray-300"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/watch/${movie._id}`}
                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold text-lg shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105"
              >
                <FiPlay className="w-6 h-6" />
                <span>Play Now</span>
              </Link>
              <Link
                href={`/movie/${movie._id}`}
                className="flex items-center space-x-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-semibold text-lg hover:bg-white/20 transition-all duration-300"
              >
                <FiInfo className="w-6 h-6" />
                <span>More Info</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
