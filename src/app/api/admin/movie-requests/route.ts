import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import MovieRequest from "@/models/MovieRequest";
import User from "@/models/User";

// GET - Fetch all movie requests
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 });
    }

    const requests = await MovieRequest.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: requests });
  } catch (error) {
    console.error("Error fetching movie requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch movie requests" },
      { status: 500 }
    );
  }
}

// PUT - Update movie request status
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 });
    }

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "Request ID and status are required" },
        { status: 400 }
      );
    }

    if (!["pending", "fulfilled", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const request = await MovieRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!request) {
      return NextResponse.json(
        { error: "Movie request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: request });
  } catch (error) {
    console.error("Error updating movie request:", error);
    return NextResponse.json(
      { error: "Failed to update movie request" },
      { status: 500 }
    );
  }
}

// DELETE - Delete movie request
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 }
      );
    }

    const request = await MovieRequest.findByIdAndDelete(id);

    if (!request) {
      return NextResponse.json(
        { error: "Movie request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting movie request:", error);
    return NextResponse.json(
      { error: "Failed to delete movie request" },
      { status: 500 }
    );
  }
}
