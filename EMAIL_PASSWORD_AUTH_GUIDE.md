# Email & Password Authentication Setup - Complete Guide

## ✅ What Has Been Added

### 1. **Email/Password Authentication**
- CredentialsProvider added to NextAuth configuration
- Password hashing with bcryptjs
- Secure credentials validation

### 2. **Sign-up System**
- Sign-up page at `/auth/sign-up`
- Account creation with email verification
- Password strength validation (min 6 characters)

### 3. **Password Reset Flow**
- Forgot password page at `/auth/forgot-password`
- Reset password page at `/auth/reset-password`
- 24-hour expiring reset tokens
- Secure token generation with crypto

### 4. **Email Integration**
- Password reset email template with nodemailer
- Welcome email functionality
- Styled HTML emails with brand colors
- Text fallback for all emails

### 5. **API Endpoints**
```
POST   /api/auth/sign-up                 - Create new account
POST   /api/auth/forgot-password         - Send reset email
GET    /api/auth/verify-reset-token      - Verify token validity
POST   /api/auth/reset-password          - Reset password with token
```

### 6. **Database Updates**
- User model now includes:
  - `passwordHash` - Hashed password (null for OAuth users)
  - `resetToken` - Token for password reset
  - `resetTokenExpiry` - Token expiration date

## 🚀 Installation & Setup

### Step 1: Clear node_modules and reinstall
```bash
npm install
# or
yarn install
# or
pnpm install
```

### Step 2: Update .env.local
Make sure you have all required environment variables:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=http://localhost:3000
# For production:
# NEXTAUTH_URL=https://yourdomain.com

# Google OAuth (if using Google sign-in)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Database
MONGODB_URI=your_mongodb_connection_string

# Nodemailer Configuration
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
COMPANY_NAME=Power Electronics

# Cloudinary (optional, for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Public Currency
NEXT_PUBLIC_CURRENCY=INR
```

### Step 3: Configure Nodemailer (Gmail Example)

1. **Enable 2-factor authentication** in your Gmail account
2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select Mail and Windows Computer
   - Copy the generated password
3. **Add to .env.local**:
   ```bash
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_16_character_app_password
   ```

### Step 4: Test the Flow

1. Start development server:
   ```bash
   npm run dev
   ```

2. **Test Sign-up**:
   - Go to `/auth/sign-up`
   - Create an account with email and password
   - Check that user is created in MongoDB

3. **Test Sign-in**:
   - Go to `/sign-in`
   - Choose "Sign in with Email"
   - Enter credentials
   - Should redirect to `/admin` if successful

4. **Test Forgot Password**:
   - Go to `/auth/forgot-password`
   - Enter your email
   - Check your email inbox for reset link
   - Click link and set new password

## 📧 Email Configuration Details

### Gmail (Recommended for Development)
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### Other SMTP Services

**SendGrid**:
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
```

**AWS SES**:
```bash
SMTP_HOST=email-smtp.region.amazonaws.com
SMTP_PORT=587
SMTP_USER=your_ses_username
SMTP_PASSWORD=your_ses_password
```

**Mailgun**:
```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your_domain.com
SMTP_PASSWORD=your_mailgun_password
```

## 🔐 Security Features

✅ **Password Security**:
- Passwords hashed with bcryptjs (10 salt rounds)
- Passwords never stored in plain text
- OAuth users don't need passwords

✅ **Reset Token Security**:
- Random 32-byte tokens generated with crypto
- Tokens hashed before storing in database
- 24-hour expiration
- One-time use only

✅ **Email Validation**:
- Email format validation
- Unique email constraint in database
- User existence checks

## 📱 Authentication Flow

### Sign-up Flow
1. User fills signup form
2. Password validated (min 6 chars)
3. Password hashed with bcryptjs
4. User created in MongoDB
5. Redirect to sign-in

### Sign-in Flow (Email/Password)
1. User enters email and password
2. Email lookup in database
3. Password compared with hash
4. Session created if valid
5. JWT token generated
6. Redirect to callback URL

### Forgot Password Flow
1. User enters email
2. System generates reset token
3. Reset link sent via email (24hr expiry)
4. User clicks link
5. System verifies token
6. User enters new password
7. Password updated and token cleared

## 🔄 OAuth vs Email/Password

### Google OAuth
- ✅ No password needed
- ✅ `passwordHash` is null
- ✅ User profile synced from Google
- ✅ Single click login

### Email/Password
- ✅ Full control over user data
- ✅ `passwordHash` contains bcrypt hash
- ✅ Manual account creation
- ✅ Password reset capability

## ⚙️ API Endpoint Details

### POST /api/auth/sign-up
**Request**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response** (201):
```json
{
  "message": "Account created successfully"
}
```

### POST /api/auth/forgot-password
**Request**:
```json
{
  "email": "john@example.com"
}
```

**Response** (200):
```json
{
  "message": "If an account with that email exists, you will receive a password reset link"
}
```

### GET /api/auth/verify-reset-token
**Query**: `?token=reset_token_here`

**Response** (200):
```json
{
  "message": "Token is valid"
}
```

### POST /api/auth/reset-password
**Request**:
```json
{
  "token": "reset_token_here",
  "password": "NewPassword123"
}
```

**Response** (200):
```json
{
  "message": "Password reset successfully"
}
```

## 🛠️ Troubleshooting

### "Module not found: Can't resolve 'next-auth/middleware'"
✅ **Fixed** - Updated to use correct NextAuth v5 syntax

### Email not sending
- [ ] Check SMTP credentials in .env.local
- [ ] Verify Gmail app password (not regular password)
- [ ] Check email address format
- [ ] Verify SMTP port (587 for TLS, 465 for SSL)
- [ ] Check nodemailer logs in console

### User can't sign up
- [ ] Verify MongoDB connection
- [ ] Check password is at least 6 characters
- [ ] Ensure email doesn't already exist
- [ ] Check browser console for errors

### Reset link not working
- [ ] Verify token in database hasn't expired
- [ ] Check NEXTAUTH_URL matches callback domain
- [ ] Ensure token matches hashed value in database
- [ ] Check token expiry timestamp

### Session not persisting
- [ ] Clear browser cookies
- [ ] Verify NEXTAUTH_SECRET is set
- [ ] Check JWT settings in auth config
- [ ] Ensure session strategy is "jwt"

## 📋 File Structure

```
app/
├── sign-in/[[...sign-in]]/page.jsx       # Main sign-in page
├── auth/
│   ├── sign-up/page.jsx                  # Sign-up page
│   ├── forgot-password/page.jsx          # Forgot password
│   ├── reset-password/page.jsx           # Reset password
│   └── error/page.jsx                    # Auth errors
├── api/auth/
│   ├── [...]nextauth]/route.js           # NextAuth config
│   ├── sign-up/route.js                  # Sign-up API
│   ├── forgot-password/route.js          # Forgot password API
│   ├── reset-password/route.js           # Reset password API
│   └── verify-reset-token/route.js       # Token verification API
lib/
├── emailService.js                       # Email functions
├── emailTemplates.js                     # Email templates
└── authSeller.js                         # Admin authorization
models/
└── user.js                               # User schema with password
```

## ✨ Next Steps

1. **Customize Email Templates**: Edit colors/branding in `emailService.js`
2. **Add User Avatar**: Update profile picture after sign-up
3. **Implement Email Verification**: Add email confirmation before signup
4. **Add Social Login**: Connect more OAuth providers (GitHub, Microsoft, etc.)
5. **Setup Admin Approval**: Require admin approval for new signups
6. **Add Rate Limiting**: Prevent brute force attacks on login/reset

## 🎉 Features Summary

- ✅ Email & Password Authentication
- ✅ Google OAuth Integration
- ✅ Sign-up with Account Creation
- ✅ Forgot Password with Email Reset
- ✅ Secure Password Hashing (bcryptjs)
- ✅ Token-based Password Reset (24hr expiry)
- ✅ Styled Email Templates
- ✅ JWT Session Management
- ✅ Admin Role-based Access
- ✅ Protected Routes
- ✅ Error Handling & Validation
