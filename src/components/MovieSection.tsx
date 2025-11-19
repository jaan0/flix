"use client";

import { motion } from "framer-motion";
import { FiPlay, FiPlus, FiCheck } from "react-icons/fi";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface MovieSectionProps {
  title: string;
  movies: any[];
}

export default function MovieSection({ title, movies }: MovieSectionProps) {
  if (!movies || movies.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-white">{title}</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {movies.map((movie, index) => (
            <MovieCard key={movie._id || index} movie={movie} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MovieCard({ movie, index }: { movie: any; index: number }) {
  const { data: session } = useSession();
  const [isHovered, setIsHovered] = useState(false);
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

  const toggleList = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
        <Link href={`/movie/${movie._id}`}>
          <img
            src={movie.posterUrl || "/placeholder-movie.jpg"}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
          />
        </Link>
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto">
            <Link href={`/movie/${movie._id}`}>
              <h3 className="font-semibold text-white mb-1 line-clamp-1 cursor-pointer hover:text-purple-400 transition-colors">
                {movie.title}
              </h3>
            </Link>
            <div className="flex items-center justify-between text-xs text-gray-300 mb-3">
              <span>{movie.year}</span>
              <span className="px-2 py-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
                {movie.rating}/10
              </span>
            </div>
            
            <div className="flex space-x-2">
              <Link
                href={`/watch/${movie._id}`}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                <FiPlay className="w-4 h-4" />
                <span>Play</span>
              </Link>
              <button
                className={`p-2 backdrop-blur-sm border rounded-lg transition-all ${
                  isInList
                    ? "bg-white/20 border-white/40 text-white"
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                } disabled:opacity-50`}
                onClick={toggleList}
                disabled={loading}
                title={isInList ? "Remove from list" : "Add to list"}
              >
                {isInList ? (
                  <FiCheck className="w-4 h-4" />
                ) : (
                  <FiPlus className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quality Badge */}
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs font-semibold text-white">
          {movie.quality}
        </div>
      </div>
    </motion.div>
  );
}
