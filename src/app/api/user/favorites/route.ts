import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Movie from "@/models/Movie";

// GET - Fetch user's favorite movies
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch all favorite movies
    const favoriteMovies = await Movie.find({
      _id: { $in: user.favorites || [] },
    }).lean();

    return NextResponse.json(
      {
        success: true,
        data: JSON.parse(JSON.stringify(favoriteMovies)),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Fetch favorites error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

// POST - Add movie to favorites
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { movieId } = body;

    if (!movieId) {
      return NextResponse.json(
        { success: false, error: "Movie ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $addToSet: { favorites: movieId } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Movie added to favorites",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Add to favorites error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add to favorites" },
      { status: 500 }
    );
  }
}

// DELETE - Remove movie from favorites
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { movieId } = body;

    if (!movieId) {
      return NextResponse.json(
        { success: false, error: "Movie ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $pull: { favorites: movieId } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Movie removed from favorites",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Remove from favorites error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to remove from favorites" },
      { status: 500 }
    );
  }
}
