import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { createClerkClient } from '@clerk/nextjs/server';

// Initialize clerkClient with your secret key
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify clerkClient is initialized
    if (!clerkClient || !clerkClient.users) {
    
      return NextResponse.json({ 
        error: 'Server configuration error: Clerk client not initialized' 
      }, { status: 500 });
    }

  

    // Check if current user is admin
    const currentUser = await clerkClient.users.getUser(userId);

    
    if (currentUser.publicMetadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    console.log('Fetching user list...');

    // Get all users - Note: getUserList returns an object with data property
    const response = await clerkClient.users.getUserList({
      limit: 100,
      orderBy: '-created_at'
    });



    // Extract the data array from the response
    const userList = response.data || response || [];

    if (!Array.isArray(userList)) {

      return NextResponse.json({ 
        error: 'Invalid user list format received from Clerk',
        debug: {
          responseType: typeof response,
          responseKeys: Object.keys(response),
          dataType: typeof response.data,
          isArray: Array.isArray(userList)
        }
      }, { status: 500 });
    }

    const formattedUsers = userList.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddresses: user.emailAddresses,
      phoneNumbers: user.phoneNumbers,
      role: user.publicMetadata?.role || 'clerk',
      createdAt: user.createdAt,
      lastSignInAt: user.lastSignInAt
    }));



    return NextResponse.json({ users: formattedUsers });

  } catch (error) {

    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
