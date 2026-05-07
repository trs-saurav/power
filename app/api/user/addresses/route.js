import connectDB from "@/config/db";
import Address from "@/models/address";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const email = authHeader?.split(" ")[1];

    if (!email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const addresses = await Address.find({ userEmail: email });

    return NextResponse.json(
      { addresses },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get addresses error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const email = authHeader?.split(" ")[1];

    if (!email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, phone, street, city, state, zipCode, country } = 
      await request.json();

    if (!name || !phone || !street || !city || !state || !zipCode || !country) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const newAddress = new Address({
      userEmail: email,
      name,
      phone,
      street,
      city,
      state,
      zipCode,
      country,
    });

    await newAddress.save();

    return NextResponse.json(
      { message: "Address added successfully", address: newAddress },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create address error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
