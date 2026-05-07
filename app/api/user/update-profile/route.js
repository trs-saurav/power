import connectDB from "@/config/db";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, imageUrl, gender, phone, dateOfBirth, bio } = body;
    
    const authHeader = request.headers.get("Authorization");
    
    if (!authHeader?.startsWith("Bearer ")) {
      console.log("❌ Invalid token format");
      return NextResponse.json(
        { message: "Unauthorized - Invalid token format" },
        { status: 401 }
      );
    }

    const email = authHeader.substring(7).trim();

    console.log("📝 Update request for email:", email);
    console.log("📦 Raw body:", body);

    if (!email || email === "undefined" || email === "null") {
      console.log("❌ Invalid email extracted from token");
      return NextResponse.json(
        { message: "Unauthorized - Invalid email" },
        { status: 401 }
      );
    }

    // Build update object - include all fields that are provided
    const updateData = {};
    
    // Update name (required)
    if (name !== undefined && name !== null && name.trim() !== "") {
      updateData.name = name.trim();
      console.log("✅ Name:", updateData.name);
    }
    
    // Update imageUrl
    if (imageUrl !== undefined && imageUrl !== null) {
      updateData.imageUrl = imageUrl === "" ? "" : imageUrl;
      console.log("✅ ImageUrl:", updateData.imageUrl);
    }
    
    // Update gender - only if it's a valid enum value
    if (gender !== undefined && gender !== null) {
      if (gender === "" || !gender.trim()) {
        updateData.gender = null;
      } else if (['male', 'female', 'other', 'prefer-not-to-say'].includes(gender)) {
        updateData.gender = gender;
      }
      console.log("✅ Gender:", updateData.gender);
    }
    
    // Update phone
    if (phone !== undefined && phone !== null) {
      updateData.phone = phone === "" ? null : phone;
      console.log("✅ Phone:", updateData.phone);
    }
    
    // Update dateOfBirth
    if (dateOfBirth !== undefined && dateOfBirth !== null) {
      if (dateOfBirth === "" || !dateOfBirth) {
        updateData.dateOfBirth = null;
      } else {
        updateData.dateOfBirth = new Date(dateOfBirth);
      }
      console.log("✅ DateOfBirth:", updateData.dateOfBirth);
    }
    
    // Update bio
    if (bio !== undefined && bio !== null) {
      updateData.bio = bio;
      console.log("✅ Bio:", updateData.bio);
    }

    console.log("📦 Final update data:", JSON.stringify(updateData, null, 2));

    const updatedUser = await User.findByIdAndUpdate(
      email,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      console.log("❌ User not found:", email);
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    console.log("✅ User updated successfully");
    console.log("Updated user data:", {
      name: updatedUser.name,
      gender: updatedUser.gender,
      phone: updatedUser.phone,
      dateOfBirth: updatedUser.dateOfBirth,
      bio: updatedUser.bio,
      imageUrl: updatedUser.imageUrl,
    });

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        success: true,
        user: {
          name: updatedUser.name,
          email: updatedUser.email,
          imageUrl: updatedUser.imageUrl,
          gender: updatedUser.gender,
          phone: updatedUser.phone,
          dateOfBirth: updatedUser.dateOfBirth,
          bio: updatedUser.bio,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Update profile error:", error);
    console.error("Error message:", error.message);
    console.error("Error details:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
