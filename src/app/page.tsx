import Navbar from "@/components/Navbar";
import MovieHero from "@/components/MovieHero";
import MovieSection from "@/components/MovieSection";
import ComingSoonBanner from "@/components/ComingSoonBanner";
import Footer from "@/components/Footer";
import dbConnect from "@/lib/mongodb";
import Movie from "@/models/Movie";

async function getMovies() {
  try {
    await dbConnect();
    const movies = await Movie.find({}).sort({ createdAt: -1 }).limit(20).lean();
    return JSON.parse(JSON.stringify(movies));
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
}

async function getFeaturedMovie() {
  try {
    await dbConnect();
    const movie = await Movie.findOne({ featured: true }).lean();
    return movie ? JSON.parse(JSON.stringify(movie)) : null;
  } catch (error) {
    console.error("Error fetching featured movie:", error);
    return null;
  }
}

export default async function Home() {
  const [movies, featuredMovie] = await Promise.all([
    getMovies(),
    getFeaturedMovie(),
  ]);

  const trendingMovies = movies.slice(0, 10);
  const newReleases = movies.filter((m: any) => new Date(m.createdAt).getFullYear() === 2025);
  const topRated = movies.filter((m: any) => m.rating >= 7).slice(0, 10);

  return (
    <main className="min-h-screen bg-gray-900">
      <Navbar />
      <MovieHero movie={featuredMovie} />
      
      <div className="relative z-10 -mt-32 space-y-16 pb-24">
        <MovieSection title="Trending Now" movies={trendingMovies} />
        <MovieSection title="New Releases" movies={newReleases} />
        <MovieSection title="Top Rated" movies={topRated} />
        <ComingSoonBanner />
      </div>
      
      <Footer />
    </main>
  );
}
