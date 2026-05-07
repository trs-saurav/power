import connectDB from "@/config/db";
import Address from "@/models/address";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    const authHeader = request.headers.get("Authorization");
    const email = authHeader?.split(" ")[1];

    if (!email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    const { name, phone, street, city, state, zipCode, country } = 
      await request.json();

    await connectDB();

    const address = await Address.findByIdAndUpdate(
      id,
      {
        name,
        phone,
        street,
        city,
        state,
        zipCode,
        country,
      },
      { new: true }
    );

    if (!address) {
      return NextResponse.json(
        { message: "Address not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Address updated successfully", address },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update address error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const authHeader = request.headers.get("Authorization");
    const email = authHeader?.split(" ")[1];

    if (!email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    await connectDB();

    const address = await Address.findByIdAndDelete(id);

    if (!address) {
      return NextResponse.json(
        { message: "Address not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Address deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete address error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
