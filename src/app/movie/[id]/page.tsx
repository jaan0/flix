import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import dbConnect from "@/lib/mongodb";
import Movie from "@/models/Movie";
import MovieDetailClient from "@/components/MovieDetailClient";
import { notFound } from "next/navigation";

async function getMovie(id: string) {
  try {
    await dbConnect();
    const movie = await Movie.findById(id).lean();
    return movie ? JSON.parse(JSON.stringify(movie)) : null;
  } catch (error) {
    return null;
  }
}

async function getSimilarMovies(genre: string[], excludeId: string) {
  try {
    await dbConnect();
    const movies = await Movie.find({
      genre: { $in: genre },
      _id: { $ne: excludeId },
    })
      .limit(6)
      .lean();
    return JSON.parse(JSON.stringify(movies));
  } catch (error) {
    return [];
  }
}

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await getMovie(id);

  if (!movie) {
    notFound();
  }

  const similarMovies = await getSimilarMovies(movie.genre, movie._id);

  return (
    <main className="min-h-screen bg-gray-900">
      <Navbar />
      <MovieDetailClient movie={movie} similarMovies={similarMovies} />
      <Footer />
    </main>
  );
}
