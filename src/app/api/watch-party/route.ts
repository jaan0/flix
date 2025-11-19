import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import WatchParty from "@/models/WatchParty";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";

// Create a new watch party
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, movieId, hostId, username, password } = body;

    if (!name || !movieId || !hostId || !username) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const partyCode = nanoid(10);
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    // Party expires in 24 hours
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const party = await WatchParty.create({
      name,
      movieId,
      hostId,
      password: hashedPassword,
      partyCode,
      expiresAt,
      participants: [
        {
          userId: hostId,
          username,
          joinedAt: new Date(),
        },
      ],
    });

    return NextResponse.json({
      success: true,
      data: {
        partyCode: party.partyCode,
        name: party.name,
        movieId: party.movieId,
      },
    });
  } catch (error: any) {
    console.error("Error creating watch party:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
