# NextAuth Migration Guide

## Migration Completed ✅

The website has been successfully migrated from **Clerk** to **NextAuth** with Google OAuth support.

## What Was Changed

### 1. Authentication Provider Setup
- ✅ Installed `next-auth` package
- ✅ Created NextAuth configuration at `app/api/auth/[...nextauth]/route.js`
- ✅ Configured Google OAuth provider
- ✅ Set up JWT session strategy

### 2. Core Components Updated
- ✅ Root layout: `ClerkProvider` → `SessionProvider`
- ✅ Middleware: Updated to work with NextAuth
- ✅ Sign-in page: Created custom page with Google OAuth button
- ✅ ProtectedRoute: Updated to use `useSession` from next-auth
- ✅ AppContext: Migrated from Clerk hooks to NextAuth

### 3. UI Components Updated
- ✅ Navbar: Updated user button and sign-in flow
- ✅ Seller Navbar: Updated authentication and user menu
- ✅ Admin pages: Updated to use NextAuth session

### 4. API Routes Updated
- ✅ `/api/product/add`
- ✅ `/api/user/data`
- ✅ `/api/user/get-address`
- ✅ `/api/cart/get`
- ✅ `/api/cart/update`
- ✅ `/api/order/create`
- ✅ `/api/order/list`
- ✅ `/api/order/update`
- ✅ `/api/gallery/*`

### 5. Database & Authorization
- ✅ Updated User model with `role` field
- ✅ Updated `authSeller` function to query MongoDB instead of Clerk
- ✅ User ID now uses email as primary identifier

## Next Steps - IMPORTANT ⚠️

### 1. Add Google OAuth Credentials to `.env.local`

Get your Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/):

```bash
# .env.local
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXTAUTH_SECRET=generate_a_random_secret_here
NEXTAUTH_URL=http://localhost:3000  # Change to your production URL
```

To generate NEXTAUTH_SECRET, run:
```bash
openssl rand -base64 32
```

### 2. Set Up Google OAuth in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy Client ID and Client Secret to your `.env.local`

### 3. Update Admin User Roles

To make a user an admin in the database, update their role:

```javascript
// MongoDB query example
db.users.updateOne(
  { _id: "user@example.com" },
  { $set: { role: "admin" } }
)
```

### 4. Remove Clerk Environment Variables

Remove these from `.env.local`:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

### 5. Update Inngest Webhooks

The Inngest configuration currently references Clerk webhook events. You have two options:

**Option A: Remove Clerk sync (Recommended if not using Inngest for other services)**
- Comment out or remove the Clerk webhook handlers in `config/inngest.js`

**Option B: Replace with NextAuth events**
- Implement custom NextAuth event handlers to sync user data

### 6. Install Dependencies

```bash
npm install
# or
yarn install
```

### 7. Test the Migration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/sign-in`

3. Click "Sign in with Google"

4. Complete the Google OAuth flow

5. You should be redirected to the homepage with your profile

## Key Differences from Clerk

| Feature | Clerk | NextAuth |
|---------|-------|----------|
| User ID | Unique Clerk ID | Email address |
| Role Management | `publicMetadata.role` | `role` field in User model |
| Sign Out | `signOut()` from `useAuth` | `signOut()` from `next-auth/react` |
| Session | Automatic token refresh | JWT-based with optional refresh |
| User Info | From `useUser()` hook | From `useSession()` hook |

## User Model Structure

```javascript
{
  _id: "user@example.com",  // Email as ID
  name: "User Name",
  email: "user@example.com",
  imageUrl: "https://...",  // Google profile picture
  role: "user" | "admin",    // NEW: Role field
  cartItems: {}
}
```

## Troubleshooting

### "Unauthorized" errors on API routes
- Make sure user is logged in
- Check if session is properly created
- Verify Google OAuth credentials are correct

### Sign-in not working
- Check Google OAuth credentials in `.env.local`
- Verify callback URL matches in Google Cloud Console
- Check browser console for errors

### Admin page not accessible
- Ensure user role is set to "admin" in MongoDB
- Sign out and sign back in to refresh session
- Check that `session.user.role === 'admin'`

### Cart not persisting
- Verify user is authenticated before adding items
- Check that cart data is being sent correctly
- Ensure User model exists in MongoDB

## Production Checklist

Before deploying to production:

- [ ] Google OAuth credentials set up for production domain
- [ ] `NEXTAUTH_URL` set to your production domain
- [ ] `NEXTAUTH_SECRET` generated and set
- [ ] All Clerk environment variables removed
- [ ] Database has admin user(s) with role: "admin"
- [ ] Email-based redirects work properly
- [ ] All API routes tested with authentication
- [ ] Sign-in/Sign-out flow verified
- [ ] Session persistence tested across page reloads

## Support

For NextAuth documentation: https://next-auth.js.org/
For Google OAuth setup: https://next-auth.js.org/providers/google
