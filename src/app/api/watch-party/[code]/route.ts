import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import WatchParty from "@/models/WatchParty";
import bcrypt from "bcryptjs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await dbConnect();
    const { code } = await params;

    const party = await WatchParty.findOne({ partyCode: code });

    if (!party) {
      return NextResponse.json(
        { success: false, error: "Party not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        name: party.name,
        movieId: party.movieId,
        hasPassword: !!party.password,
        participants: party.participants.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Join watch party
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await dbConnect();
    const { code } = await params;
    const body = await request.json();
    const { userId, username, password } = body;

    const party = await WatchParty.findOne({ partyCode: code });

    if (!party) {
      return NextResponse.json(
        { success: false, error: "Party not found" },
        { status: 404 }
      );
    }

    // Check password if required
    if (party.password) {
      if (!password) {
        return NextResponse.json(
          { success: false, error: "Password required" },
          { status: 401 }
        );
      }

      const isValid = await bcrypt.compare(password, party.password);
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: "Invalid password" },
          { status: 401 }
        );
      }
    }

    // Check if user already joined
    const alreadyJoined = party.participants.some(
      (p: any) => p.userId === userId
    );

    if (!alreadyJoined) {
      party.participants.push({
        userId,
        username,
        joinedAt: new Date(),
      });
      await party.save();
    }

    return NextResponse.json({
      success: true,
      data: {
        partyCode: party.partyCode,
        name: party.name,
        movieId: party.movieId,
        currentTime: party.currentTime,
        isPlaying: party.isPlaying,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
