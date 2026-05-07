import connectDB from "@/config/db";
import Address from "@/models/address";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function PUT(request, { params }) {
  try {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { name, phone, street, city, state, zipCode, country } = await request.json();

    await connectDB();

    const address = await Address.findOneAndUpdate(
      { _id: id, userEmail: email },
      { name, phone, street, city, state, zipCode, country },
      { new: true }
    );

    if (!address) {
      return NextResponse.json({ message: "Address not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Address updated successfully", address }, { status: 200 });
  } catch (error) {
    console.error("Update address error:", error);
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const address = await Address.findOneAndDelete({ _id: id, userEmail: email });

    if (!address) {
      return NextResponse.json({ message: "Address not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Address deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete address error:", error);
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}
