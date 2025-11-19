import dbConnect from "@/lib/mongodb";
import Movie from "@/models/Movie";
import WatchClient from "@/components/WatchClient";
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

export default async function WatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await getMovie(id);

  if (!movie) {
    notFound();
  }

  return <WatchClient movie={movie} />;
}
