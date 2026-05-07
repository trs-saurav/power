import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Address from "@/models/address";
import { auth } from "@/auth";

export async function POST(request) {
    try {
        console.log('Starting address creation...');
        
        const session = await auth();
        const userId = session?.user?.id || session?.user?.email; // Fallback to email if id is not available
        
        console.log('User ID from session:', userId);
        
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" }, 
                { status: 401 }
            );
        }

        const body = await request.json();
        console.log('Request body:', body);
        
        const { address } = body;
        
        if (!address) {
            return NextResponse.json(
                { success: false, message: "Address data is required" }, 
                { status: 400 }
            );
        }

        console.log('Connecting to database...');
        await connectDB();
        
        console.log('Creating address document...');
        const newAddress = await Address.create({
            ...address, 
            userId
        });
        
        console.log('Address created successfully:', newAddress._id);

        return NextResponse.json({
            success: true, 
            message: "Address added successfully", 
            address: newAddress 
        }, { status: 201 });

    } catch (error) {
        console.error("Detailed error adding address:", {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        
        return NextResponse.json(
            { success: false, message: error.message || "Error adding address" }, 
            { status: 500 }
        );
    }
}
