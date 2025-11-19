"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { FiPlay, FiPlus, FiCheck, FiShare2, FiStar } from "react-icons/fi";
import Link from "next/link";
import MovieSection from "./MovieSection";

export default function MovieDetailClient({ movie, similarMovies }: any) {
  const { data: session } = useSession();
  const [isInList, setIsInList] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      checkIfInList();
    }
  }, [session, movie._id]);

  const checkIfInList = async () => {
    try {
      const response = await fetch("/api/user/favorites");
      const data = await response.json();
      if (data.success) {
        setIsInList(data.data.some((m: any) => m._id === movie._id));
      }
    } catch (error) {
      console.error("Error checking favorites:", error);
    }
  };

  const toggleList = async () => {
    if (!session) {
      alert("Please login to add movies to your list");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/user/favorites", {
        method: isInList ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: movie._id }),
      });

      const data = await response.json();
      if (data.success) {
        setIsInList(!isInList);
      }
    } catch (error) {
      console.error("Error toggling favorites:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <img
          src={movie.posterUrl || movie.thumbnailUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative -mt-32 z-10 px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
                <FiStar className="w-5 h-5 text-white fill-white" />
                <span className="font-bold text-white">{movie.rating}/10</span>
              </div>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white">
                {movie.year}
              </span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white">
                {movie.duration} min
              </span>
              <span className="px-4 py-2 border border-purple-500/50 rounded-full text-purple-300">
                {movie.quality}
              </span>
            </div>

            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              {movie.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {movie.genre.map((g: string) => (
                <span
                  key={g}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300"
                >
                  {g}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <Link
                href={`/watch/${movie._id}`}
                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold text-lg shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105"
              >
                <FiPlay className="w-6 h-6" />
                <span>Watch Now</span>
              </Link>
              <button
                onClick={toggleList}
                disabled={loading}
                className={`flex items-center space-x-2 px-8 py-4 backdrop-blur-sm border rounded-full font-semibold text-lg transition-all duration-300 ${
                  isInList
                    ? "bg-white/20 border-white/40 text-white hover:bg-white/30"
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                } disabled:opacity-50`}
              >
                {isInList ? (
                  <FiCheck className="w-6 h-6" />
                ) : (
                  <FiPlus className="w-6 h-6" />
                )}
                <span>{isInList ? "In My List" : "Add to List"}</span>
              </button>
              <button className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300">
                <FiShare2 className="w-6 h-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
              <div>
                <h3 className="text-sm text-gray-400 mb-2">Director</h3>
                <p className="text-white font-semibold">{movie.director}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 mb-2">Language</h3>
                <p className="text-white font-semibold">{movie.language}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm text-gray-400 mb-2">Cast</h3>
                <p className="text-white">{movie.cast.join(", ")}</p>
              </div>
            </div>
          </motion.div>

          {/* Similar Movies */}
          {similarMovies.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-6 text-white">More Like This</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {similarMovies.map((m: any, index: number) => (
                  <Link key={m._id} href={`/movie/${m._id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800"
                    >
                      <img
                        src={m.posterUrl}
                        alt={m.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h4 className="font-semibold text-white text-sm line-clamp-1">
                            {m.title}
                          </h4>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
