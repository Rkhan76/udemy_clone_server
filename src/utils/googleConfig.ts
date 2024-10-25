// src/utils/googleOAuthClient.ts

import { google, Auth } from 'googleapis'

// Ensure your environment variables are defined
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string

// Create a new instance of OAuth2 client
export const oauth2Client: Auth.OAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  'postmessage'
)
