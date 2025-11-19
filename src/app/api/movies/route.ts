import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Movie from "@/models/Movie";

// GET all movies or search
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const genre = searchParams.get("genre");
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");

    let query: any = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (genre) {
      query.genre = genre;
    }

    if (featured) {
      query.featured = featured === "true";
    }

    const movies = await Movie.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Movie.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: movies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new movie
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    const body = await request.json();
    console.log("Creating movie with data:", body);

    // Extract requestId if provided
    const { requestId, ...movieData } = body;

    const movie = await Movie.create(movieData);

    // If this movie fulfills a request, update the request status
    if (requestId) {
      const MovieRequest = (await import("@/models/MovieRequest")).default;
      await MovieRequest.findByIdAndUpdate(requestId, {
        status: "fulfilled",
      });
      console.log("Marked movie request as fulfilled:", requestId);
    }

    return NextResponse.json({ success: true, data: movie }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating movie:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
