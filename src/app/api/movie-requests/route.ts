import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import MovieRequest from "@/models/MovieRequest";

// POST - Create new movie request
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    
    // Validate required fields
    if (!body.movieTitle || !body.movieTitle.trim()) {
      return NextResponse.json(
        { success: false, error: "Movie title is required" },
        { status: 400 }
      );
    }

    const movieRequest = await MovieRequest.create({
      movieTitle: body.movieTitle,
      releaseYear: body.releaseYear,
      directorActors: body.directorActors,
      userName: body.userName,
      email: body.email,
      notifyWhenAvailable: body.notifyWhenAvailable || false,
    });

    return NextResponse.json(
      { success: true, data: movieRequest, message: "Movie request submitted successfully!" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating movie request:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit request" },
      { status: 500 }
    );
  }
}

// GET - Get all movie requests (admin only)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");

    let query: any = {};

    if (status) {
      query.status = status;
    }

    const requests = await MovieRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await MovieRequest.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching movie requests:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
