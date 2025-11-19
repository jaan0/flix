"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiHeart, FiPlay, FiInfo } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MyListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      fetchFavorites();
    }
  }, [status, router]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch("/api/user/favorites");
      const data = await response.json();
      
      if (data.success) {
        setFavorites(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (movieId: string) => {
    try {
      const response = await fetch("/api/user/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId }),
      });

      const data = await response.json();

      if (data.success) {
        setFavorites(favorites.filter((movie) => movie._id !== movieId));
      }
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="pt-32 pb-24 px-4 flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <main className="pt-32 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-3 mb-8">
              <FiHeart className="text-pink-500" size={32} />
              <h1 className="text-4xl font-bold text-white">My List</h1>
            </div>

            {favorites.length === 0 ? (
              <div className="text-center py-20">
                <FiHeart className="mx-auto text-gray-600 mb-4" size={64} />
                <h2 className="text-2xl font-semibold text-gray-400 mb-2">
                  Your list is empty
                </h2>
                <p className="text-gray-500 mb-6">
                  Add movies to your list to watch them later
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  <span>Browse Movies</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {favorites.map((movie) => (
                  <motion.div
                    key={movie._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group relative"
                  >
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                      {movie.posterUrl || movie.thumbnailUrl ? (
                        <Image
                          src={movie.posterUrl || movie.thumbnailUrl}
                          alt={movie.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          No Image
                        </div>
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-semibold mb-2 line-clamp-2">
                            {movie.title}
                          </h3>
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="px-2 py-1 bg-purple-600 rounded text-xs font-semibold">
                              {movie.rating}/10
                            </span>
                            <span className="text-xs text-gray-300">
                              {movie.year}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Link
                              href={`/watch/${movie._id}`}
                              className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-white text-black rounded text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                              <FiPlay size={14} />
                              <span>Play</span>
                            </Link>
                            <Link
                              href={`/movie/${movie._id}`}
                              className="flex items-center justify-center px-3 py-2 bg-white/20 backdrop-blur-sm text-white rounded hover:bg-white/30 transition-colors"
                            >
                              <FiInfo size={16} />
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromFavorites(movie._id)}
                        className="absolute top-2 right-2 p-2 bg-black/70 backdrop-blur-sm rounded-full text-pink-500 hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100"
                        title="Remove from list"
                      >
                        <FiHeart size={20} fill="currentColor" />
                      </button>
                    </div>

                    {/* Title below poster (visible on mobile) */}
                    <div className="mt-2 md:hidden">
                      <h3 className="text-white text-sm font-medium line-clamp-1">
                        {movie.title}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
