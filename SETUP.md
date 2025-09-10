# Portfolio System Setup

This portfolio system now includes an automatic setup process that guides you through creating your initial admin account.

## How It Works

### 1. Automatic Detection
When you first visit the site, the system automatically checks if it has been initialized:
- If no users or portfolios exist → Redirects to `/setup`
- If system is already set up → Shows the normal portfolio page

### 2. Setup Process
1. **Visit the site** - You'll be automatically redirected to the setup page
2. **Fill out the form** with:
   - Your email address
   - Your full name
   - Portfolio name
   - Job title
3. **Submit the form** - The system will:
   - Create your user account
   - Create your portfolio
   - Set you as the owner
   - Send you an email with a password setup link

### 3. Password Setup
1. **Check your email** for the setup completion message
2. **Click the link** to set your password
3. **Enter a secure password** (minimum 8 characters)
4. **Complete setup** and log in

## Features

### ✅ Secure Setup
- No hardcoded passwords
- Email verification required
- Temporary password tokens
- User sets their own password

### ✅ Professional Onboarding
- Clean, modern setup interface
- Clear instructions and guidance
- Error handling and validation
- Success confirmation

### ✅ Automatic Configuration
- Creates default system settings
- Sets up tech options
- Configures project limits
- Initializes all necessary data

## Security Notes

- The setup process only works when no users exist
- Temporary passwords are generated securely
- Email verification is required
- Users must set their own passwords
- Setup is a one-time process

## Troubleshooting

### Setup Page Not Showing
- Check if users already exist in the database
- Clear database if you need to reset the system
- Check database connection

### Email Not Received
- Check spam folder
- Verify email configuration in environment variables
- Check Resend API key is set correctly

### Password Reset Issues
- Ensure the reset link is used within 24 hours
- Check that the email matches exactly
- Verify the token hasn't been used already

## Environment Variables Required

```env
DATABASE_URL=your_mongodb_connection_string
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Manual Reset (Development Only)

If you need to reset the system for development:

1. Clear your database
2. Visit the site - you'll be redirected to setup
3. Go through the setup process again

## Production Deployment

1. Deploy your application
2. Set up environment variables
3. Visit your domain - setup will start automatically
4. Complete the setup process
5. Your portfolio system is ready!

This approach ensures a secure, professional onboarding experience while maintaining security best practices.
