"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiUsers } from "react-icons/fi";
import Link from "next/link";
import VideoPlayer from "./VideoPlayer";
import CreatePartyModal from "./CreatePartyModal";

function getYoutubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : '';
}

export default function WatchClient({ movie }: any) {
  const [showPartyModal, setShowPartyModal] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link
            href={`/movie/${movie._id}`}
            className="flex items-center space-x-2 text-white hover:text-purple-400 transition-colors"
          >
            <FiArrowLeft className="w-6 h-6" />
            <span className="font-semibold">Back</span>
          </Link>
          <h1 className="text-white font-bold text-xl">{movie.title}</h1>
          <button
            onClick={() => setShowPartyModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            <FiUsers className="w-5 h-5" />
            <span>Watch Party</span>
          </button>
        </div>
      </div>

      {/* Video Player */}
      <div className="relative w-full bg-black pt-20">
        <div className="max-w-7xl mx-auto px-4">
          {movie.videoUrl ? (
            movie.videoUrl.includes('youtube.com') || movie.videoUrl.includes('youtu.be') ? (
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${getYoutubeId(movie.videoUrl)}?autoplay=1&controls=1`}
                  className="absolute top-0 left-0 w-full h-full rounded-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="w-full aspect-video rounded-xl overflow-hidden">
                <VideoPlayer 
                  src={movie.videoUrl} 
                  poster={movie.posterUrl}
                />
              </div>
            )
          ) : (
            <div className="text-white text-xl text-center py-32">No video available</div>
          )}
        </div>
      </div>

      {/* Movie Info */}
      <div className="px-4 sm:px-6 lg:px-8 py-12 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">{movie.title}</h2>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold">
              {movie.rating}/10
            </span>
            <span className="text-gray-400">{movie.year}</span>
            <span className="text-gray-400">{movie.duration} min</span>
            <span className="px-3 py-1 border border-purple-500/50 rounded-full text-purple-300">
              {movie.quality}
            </span>
          </div>
          <p className="text-gray-300 mb-6">{movie.description}</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm text-gray-400 mb-2">Director</h3>
              <p className="text-white">{movie.director}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-400 mb-2">Cast</h3>
              <p className="text-white">{movie.cast.join(", ")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Party Modal */}
      {showPartyModal && (
        <CreatePartyModal
          movieId={movie._id}
          onClose={() => setShowPartyModal(false)}
          onSuccess={(partyCode) => {
            setShowPartyModal(false);
            router.push(`/party/${partyCode}`);
          }}
        />
      )}
    </div>
  );
}
