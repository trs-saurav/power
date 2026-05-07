import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import connectDB from "@/config/db";
import User from "@/models/user";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    await connectDB();

    // Fetch users from our own MongoDB instead of Clerk
    const users = await User.find({}).sort({ createdAt: -1 });

    const formattedUsers = users.map(user => ({
      id: user._id,
      firstName: user.name?.split(' ')[0] || '',
      lastName: user.name?.split(' ').slice(1).join(' ') || '',
      emailAddresses: [{ emailAddress: user.email }],
      phoneNumbers: user.phone ? [{ phoneNumber: user.phone }] : [],
      role: user.role || 'user',
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
    }));

    return NextResponse.json({ users: formattedUsers });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}
