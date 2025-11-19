"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiFilm,
  FiUsers,
  FiEye,
  FiTrendingUp,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import AddMovieModal from "./AddMovieModal";

export default function AdminDashboard() {
  const [movies, setMovies] = useState([]);
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalUsers: 0,
    totalViews: 0,
    avgRating: 0,
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"movies" | "requests">("movies");
  const [movieRequests, setMovieRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  useEffect(() => {
    fetchMovies();
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === "requests") {
      fetchMovieRequests();
    }
  }, [activeTab]);

  const fetchMovies = async () => {
    try {
      const res = await fetch("/api/movies");
      const data = await res.json();
      if (data.success) {
        setMovies(data.data);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const deleteMovie = async (id: string) => {
    if (!confirm("Are you sure you want to delete this movie?")) return;

    try {
      const res = await fetch(`/api/movies/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchMovies();
        fetchStats();
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  const fetchMovieRequests = async () => {
    setRequestsLoading(true);
    try {
      const res = await fetch("/api/admin/movie-requests");
      const data = await res.json();
      if (data.success) {
        setMovieRequests(data.data);
      }
    } catch (error) {
      console.error("Error fetching movie requests:", error);
    } finally {
      setRequestsLoading(false);
    }
  };

  const updateRequestStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/movie-requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        fetchMovieRequests();
      }
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  const deleteRequest = async (id: string) => {
    if (!confirm("Are you sure you want to delete this request?")) return;

    try {
      const res = await fetch(`/api/admin/movie-requests?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchMovieRequests();
      }
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  const filteredMovies = movies.filter((movie: any) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HiSparkles className="w-8 h-8 text-purple-400" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                MyFlix Admin
              </h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold shadow-lg shadow-purple-500/50"
            >
              <FiPlus className="w-5 h-5" />
              <span>Add Movie</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-2 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab("movies")}
            className={`px-6 py-3 font-semibold transition-all relative ${
              activeTab === "movies"
                ? "text-white"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Movies
            {activeTab === "movies" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-6 py-3 font-semibold transition-all relative ${
              activeTab === "requests"
                ? "text-white"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Movie Requests
            {movieRequests.filter((r: any) => r.status === "pending").length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {movieRequests.filter((r: any) => r.status === "pending").length}
              </span>
            )}
            {activeTab === "requests" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"
              />
            )}
          </button>
        </div>

        {/* Stats Grid */}
        {activeTab === "movies" && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={FiFilm}
              label="Total Movies"
              value={stats.totalMovies}
              color="from-purple-500 to-pink-500"
            />
            <StatCard
              icon={FiUsers}
              label="Total Users"
              value={stats.totalUsers}
              color="from-blue-500 to-cyan-500"
            />
            <StatCard
              icon={FiEye}
              label="Total Views"
              value={stats.totalViews.toLocaleString()}
              color="from-green-500 to-emerald-500"
            />
            <StatCard
              icon={FiTrendingUp}
              label="Avg Rating"
              value={stats.avgRating.toFixed(1)}
              color="from-orange-500 to-red-500"
            />
          </div>
        )}

        {/* Search */}
        {activeTab === "movies" && (
          <div className="mb-6">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </div>
        )}

        {/* Movies Table */}
        {activeTab === "movies" && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-gray-400 font-semibold">
                    Movie
                  </th>
                  <th className="text-left p-4 text-gray-400 font-semibold">
                    Genre
                  </th>
                  <th className="text-left p-4 text-gray-400 font-semibold">
                    Year
                  </th>
                  <th className="text-left p-4 text-gray-400 font-semibold">
                    Rating
                  </th>
                  <th className="text-left p-4 text-gray-400 font-semibold">
                    Views
                  </th>
                  <th className="text-right p-4 text-gray-400 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : filteredMovies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-gray-400">
                      No movies found. Add your first movie!
                    </td>
                  </tr>
                ) : (
                  filteredMovies.map((movie: any) => (
                    <tr
                      key={movie._id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <span className="text-white font-medium">
                            {movie.title}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">
                        {movie.genre.slice(0, 2).join(", ")}
                      </td>
                      <td className="p-4 text-gray-300">{movie.year}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full text-purple-300 text-sm">
                          {movie.rating}/10
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">{movie.views}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setEditingMovie(movie)}
                            className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteMovie(movie._id)}
                            className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 transition-all"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* Movie Requests Table */}
        {activeTab === "requests" && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-gray-400 font-semibold">
                      Movie Title
                    </th>
                    <th className="text-left p-4 text-gray-400 font-semibold">
                      Year
                    </th>
                    <th className="text-left p-4 text-gray-400 font-semibold">
                      Director/Actors
                    </th>
                    <th className="text-left p-4 text-gray-400 font-semibold">
                      Requested By
                    </th>
                    <th className="text-left p-4 text-gray-400 font-semibold">
                      Date
                    </th>
                    <th className="text-left p-4 text-gray-400 font-semibold">
                      Status
                    </th>
                    <th className="text-right p-4 text-gray-400 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requestsLoading ? (
                    <tr>
                      <td colSpan={7} className="text-center p-8 text-gray-400">
                        Loading requests...
                      </td>
                    </tr>
                  ) : movieRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center p-8 text-gray-400">
                        No movie requests yet.
                      </td>
                    </tr>
                  ) : (
                    movieRequests.map((request: any) => (
                      <tr
                        key={request._id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4">
                          <span className="text-white font-medium">
                            {request.movieTitle}
                          </span>
                        </td>
                        <td className="p-4 text-gray-300">
                          {request.releaseYear || "N/A"}
                        </td>
                        <td className="p-4 text-gray-300">
                          {request.directorActors || "N/A"}
                        </td>
                        <td className="p-4">
                          <div className="text-gray-300">
                            <div>{request.userName || "Anonymous"}</div>
                            {request.email && (
                              <div className="text-xs text-gray-500">{request.email}</div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-gray-300 text-sm">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              request.status === "fulfilled"
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : request.status === "rejected"
                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            }`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end space-x-2">
                            {request.status === "pending" && (
                              <>
                                <button
                                  onClick={() => updateRequestStatus(request._id, "fulfilled")}
                                  className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 transition-all text-sm"
                                  title="Mark as fulfilled"
                                >
                                  Fulfill
                                </button>
                                <button
                                  onClick={() => updateRequestStatus(request._id, "rejected")}
                                  className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-all text-sm"
                                  title="Reject request"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => deleteRequest(request._id)}
                              className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 transition-all"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Movie Modal */}
      {isAddModalOpen && (
        <AddMovieModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            fetchMovies();
            fetchStats();
            fetchMovieRequests();
            setIsAddModalOpen(false);
          }}
          movieRequests={movieRequests.filter((r: any) => r.status === "pending")}
        />
      )}

      {/* Edit Movie Modal */}
      {editingMovie && (
        <AddMovieModal
          movie={editingMovie}
          onClose={() => setEditingMovie(null)}
          onSuccess={() => {
            fetchMovies();
            fetchStats();
            setEditingMovie(null);
          }}
        />
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 overflow-hidden group hover:border-purple-500/50 transition-all duration-300"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} p-0.5 mb-4`}>
        <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      />
    </motion.div>
  );
}
