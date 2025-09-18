import { clerkClient } from '@clerk/nextjs/server';

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { firstName, lastName, emailAddress, password, phoneNumber } = body;

    // Validate required fields
    if (!firstName || !lastName || !emailAddress || !password) {
      return Response.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create user in Clerk with proper format
    const newUser = await clerkClient.users.createUser({
      firstName,
      lastName,
      emailAddresses: [
        {
          emailAddress,
          verified: false
        }
      ],
      phoneNumbers: phoneNumber ? [
        {
          phoneNumber,
          verified: false
        }
      ] : [],
      password,
      publicMetadata: {
        role: 'admin',
        createdAt: new Date().toISOString(),
        department: 'Administration'
      },
      privateMetadata: {
        internalNote: 'Created via admin panel'
      }
    });

    // Return success response
    return Response.json({
      success: true,
      message: 'Admin user created successfully',
      userId: newUser.id,
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        emailAddress: newUser.emailAddresses[0]?.emailAddress,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Clerk user creation error:', error);

    // Handle specific Clerk errors
    if (error.errors && error.errors.length > 0) {
      const clerkError = error.errors[0];
      
      if (clerkError.code === 'form_identifier_exists') {
        return Response.json(
          { message: 'A user with this email already exists' },
          { status: 409 }
        );
      }
      
      if (clerkError.code === 'form_password_pwned') {
        return Response.json(
          { message: 'This password has been found in a data breach. Please use a different password.' },
          { status: 400 }
        );
      }
      
      if (clerkError.code === 'form_password_validation') {
        return Response.json(
          { message: 'Password does not meet requirements' },
          { status: 400 }
        );
      }
      
      return Response.json(
        { message: clerkError.message || 'Validation error' },
        { status: 400 }
      );
    }

    // Generic error response
    return Response.json(
      { 
        message: 'Failed to create user',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// Optional: Add GET method to test the endpoint
export async function GET() {
  return Response.json({
    message: 'Admin user creation endpoint',
    method: 'POST',
    requiredFields: ['firstName', 'lastName', 'emailAddress', 'password'],
    optionalFields: ['phoneNumber']
  });
}
