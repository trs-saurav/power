import connectDB from "@/config/db";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    
    if (!authHeader?.startsWith("Bearer ")) {
      console.log("❌ Invalid auth header format");
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const email = authHeader.substring(7).trim();

    console.log("📡 Fetching profile for email:", email);

    if (!email || email === "undefined" || email === "null") {
      console.log("❌ Invalid email extracted");
      return NextResponse.json(
        { message: "Unauthorized - Invalid email" },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(email).select(
      "name email imageUrl gender phone phoneVerified dateOfBirth bio emailVerified"
    );

    if (!user) {
      console.log("❌ User not found:", email);
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    console.log("✅ User found");
    console.log("Profile data:", {
      name: user.name,
      gender: user.gender,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      bio: user.bio,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          name: user.name,
          email: user.email,
          imageUrl: user.imageUrl || "",
          gender: user.gender || "",
          phone: user.phone || "",
          phoneVerified: user.phoneVerified,
          dateOfBirth: user.dateOfBirth
            ? user.dateOfBirth.toISOString().split("T")[0]
            : "",
          bio: user.bio || "",
          emailVerified: user.emailVerified,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Fetch profile error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
