import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Movie from "@/models/Movie";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    const totalMovies = await Movie.countDocuments();
    const totalUsers = await User.countDocuments();
    
    const movies = await Movie.find({});
    const totalViews = movies.reduce((sum, movie) => sum + movie.views, 0);
    const avgRating = movies.length > 0 
      ? movies.reduce((sum, movie) => sum + movie.rating, 0) / movies.length
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalMovies,
        totalUsers,
        totalViews,
        avgRating,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
