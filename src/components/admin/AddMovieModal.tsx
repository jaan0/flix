"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiUpload, FiImage, FiVideo, FiCheck } from "react-icons/fi";
import Image from "next/image";

export default function AddMovieModal({ onClose, onSuccess, movie, movieRequests = [] }: any) {
  const isEditMode = !!movie;
  
  const [selectedRequestId, setSelectedRequestId] = useState<string>("");
  const [formData, setFormData] = useState({
    title: movie?.title || "",
    description: movie?.description || "",
    posterUrl: movie?.posterUrl || "",
    trailerUrl: movie?.trailerUrl || "",
    videoUrl: movie?.videoUrl || "",
    thumbnailUrl: movie?.thumbnailUrl || "",
    genre: movie?.genre || ([] as string[]),
    rating: movie?.rating || 0,
    year: movie?.year || new Date().getFullYear(),
    duration: movie?.duration || 0,
    cast: movie?.cast || ([] as string[]),
    director: movie?.director || "",
    language: movie?.language || "English",
    quality: movie?.quality || "HD",
    featured: movie?.featured || false,
  });

  const [castInput, setCastInput] = useState("");
  const [genreInput, setGenreInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingTrailer, setUploadingTrailer] = useState(false);

  const handleRequestSelect = (requestId: string) => {
    setSelectedRequestId(requestId);
    const request = movieRequests.find((r: any) => r._id === requestId);
    if (request) {
      setFormData((prev) => ({
        ...prev,
        title: request.movieTitle,
        year: request.releaseYear || new Date().getFullYear(),
        description: request.directorActors
          ? `Director/Actors: ${request.directorActors}`
          : prev.description,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditMode ? `/api/movies/${movie._id}` : "/api/movies";
      const method = isEditMode ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          requestId: selectedRequestId || undefined,
        }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        alert(`Failed to ${isEditMode ? 'update' : 'add'} movie`);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} movie:`, error);
      alert(`Error ${isEditMode ? 'updating' : 'adding'} movie`);
    } finally {
      setLoading(false);
    }
  };

  const addCast = () => {
    if (castInput.trim()) {
      setFormData({
        ...formData,
        cast: [...formData.cast, castInput.trim()],
      });
      setCastInput("");
    }
  };

  const addGenre = () => {
    if (genreInput.trim() && !formData.genre.includes(genreInput.trim())) {
      setFormData({
        ...formData,
        genre: [...formData.genre, genreInput.trim()],
      });
      setGenreInput("");
    }
  };

  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPoster(true);
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("type", "image");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await response.json();
      console.log("Poster upload response:", data);
      
      if (data.success && data.url) {
        setFormData((prev) => ({ ...prev, posterUrl: data.url }));
      } else {
        alert(`Failed to upload poster: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error uploading poster:", error);
      alert("Failed to upload poster");
    } finally {
      setUploadingPoster(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("type", "video");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await response.json();
      console.log("Video upload response:", data);
      
      if (data.success && data.url) {
        setFormData((prev) => ({ ...prev, videoUrl: data.url }));
      } else {
        alert(`Failed to upload video: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video");
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleTrailerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingTrailer(true);
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("type", "video");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await response.json();
      console.log("Trailer upload response:", data);
      
      if (data.success && data.url) {
        setFormData((prev) => ({ ...prev, trailerUrl: data.url }));
      } else {
        alert(`Failed to upload trailer: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error uploading trailer:", error);
      alert("Failed to upload trailer");
    } finally {
      setUploadingTrailer(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/85 backdrop-blur-xl z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-900 border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gray-900 border-b border-white/10 p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {isEditMode ? 'Edit Movie' : 'Add New Movie'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <FiX className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Movie Request Dropdown */}
            {!isEditMode && movieRequests.length > 0 && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                <label className="block text-sm font-semibold text-purple-300 mb-2">
                  📋 Select from Movie Requests (Optional)
                </label>
                <select
                  value={selectedRequestId}
                  onChange={(e) => handleRequestSelect(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                >
                  <option value="">-- Manual Entry --</option>
                  {movieRequests.map((request: any) => (
                    <option key={request._id} value={request._id} className="bg-gray-800">
                      {request.movieTitle} {request.releaseYear ? `(${request.releaseYear})` : ""}
                      {request.userName ? ` - by ${request.userName}` : ""}
                    </option>
                  ))}
                </select>
                {selectedRequestId && (
                  <p className="mt-2 text-sm text-green-400 flex items-center gap-2">
                    <FiCheck className="w-4 h-4" />
                    This movie request will be marked as fulfilled once you add the movie
                  </p>
                )}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Director *
                </label>
                <input
                  type="text"
                  required
                  value={formData.director}
                  onChange={(e) =>
                    setFormData({ ...formData, director: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Year *
                </label>
                <input
                  type="number"
                  required
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Duration (min) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Rating *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  required
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rating: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Language
                </label>
                <input
                  type="text"
                  value={formData.language}
                  onChange={(e) =>
                    setFormData({ ...formData, language: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Quality
                </label>
                <select
                  value={formData.quality}
                  onChange={(e) =>
                    setFormData({ ...formData, quality: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                >
                  <option value="HD">HD</option>
                  <option value="4K">4K</option>
                  <option value="1080p">1080p</option>
                  <option value="720p">720p</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Movie Poster * (Upload Image)
              </label>
              
              {/* Preview */}
              {formData.posterUrl && (
                <div className="mb-4 relative w-48 h-72 rounded-xl overflow-hidden border-2 border-purple-500/50">
                  <Image
                    src={formData.posterUrl}
                    alt="Poster preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full">
                    <FiCheck className="w-4 h-4" />
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <label className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-2 border-dashed border-purple-500/50 rounded-xl text-white cursor-pointer hover:border-purple-500 transition-all">
                {uploadingPoster ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <FiImage className="w-5 h-5" />
                    <span>{formData.posterUrl ? "Change Poster" : "Upload Poster"}</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePosterUpload}
                  className="hidden"
                  disabled={uploadingPoster}
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Recommended: 500x750px (2:3 ratio), JPG or PNG
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Movie Video * (Upload Video or Enter YouTube URL)
              </label>

              {/* Preview */}
              {formData.videoUrl && (
                <div className="mb-4 p-4 bg-white/5 border border-purple-500/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <FiCheck className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">Video uploaded!</p>
                      <p className="text-xs text-gray-400 truncate">{formData.videoUrl}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <label className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-2 border-dashed border-purple-500/50 rounded-xl text-white cursor-pointer hover:border-purple-500 transition-all mb-3">
                {uploadingVideo ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Uploading Video... (may take a while)</span>
                  </>
                ) : (
                  <>
                    <FiVideo className="w-5 h-5" />
                    <span>{formData.videoUrl ? "Change Video" : "Upload Video File"}</span>
                  </>
                )}
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                  disabled={uploadingVideo}
                />
              </label>

              {/* OR YouTube URL */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-gray-900 text-gray-400">OR Enter YouTube URL</span>
                </div>
              </div>

              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, videoUrl: e.target.value })
                }
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 mt-3"
              />
              <p className="text-xs text-gray-500 mt-2">
                Upload video file (MP4, MKV) or paste YouTube URL
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Trailer (Optional - Upload or YouTube URL)
              </label>

              {/* Preview */}
              {formData.trailerUrl && (
                <div className="mb-4 p-4 bg-white/5 border border-purple-500/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <FiCheck className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">Trailer uploaded!</p>
                      <p className="text-xs text-gray-400 truncate">{formData.trailerUrl}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <label className="flex items-center justify-center space-x-2 px-6 py-4 bg-white/5 border-2 border-dashed border-white/10 rounded-xl text-gray-400 cursor-pointer hover:border-purple-500/50 hover:text-white transition-all mb-3">
                {uploadingTrailer ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    <span>Uploading Trailer...</span>
                  </>
                ) : (
                  <>
                    <FiVideo className="w-5 h-5" />
                    <span>{formData.trailerUrl ? "Change Trailer" : "Upload Trailer"}</span>
                  </>
                )}
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleTrailerUpload}
                  className="hidden"
                  disabled={uploadingTrailer}
                />
              </label>

              {/* OR YouTube URL */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-gray-900 text-gray-400">OR Enter YouTube URL</span>
                </div>
              </div>

              <input
                type="url"
                value={formData.trailerUrl}
                onChange={(e) =>
                  setFormData({ ...formData, trailerUrl: e.target.value })
                }
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 mt-3"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Genres</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={genreInput}
                  onChange={(e) => setGenreInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addGenre())}
                  placeholder="Add genre"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                />
                <button
                  type="button"
                  onClick={addGenre}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.genre.map((g: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-purple-300 text-sm flex items-center space-x-2"
                  >
                    <span>{g}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          genre: formData.genre.filter((_: string, idx: number) => idx !== i),
                        })
                      }
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Cast</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={castInput}
                  onChange={(e) => setCastInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCast())}
                  placeholder="Add cast member"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                />
                <button
                  type="button"
                  onClick={addCast}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.cast.map((c: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-300 text-sm flex items-center space-x-2"
                  >
                    <span>{c}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          cast: formData.cast.filter((_: string, idx: number) => idx !== i),
                        })
                      }
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="w-5 h-5 rounded border-white/10 bg-white/5 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="featured" className="text-white cursor-pointer">
                Feature this movie on homepage
              </label>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                {loading ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Movie" : "Add Movie")}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
