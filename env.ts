import dotenv from 'dotenv'
dotenv.config()
let PORT = process.env.PORT ? +process.env.PORT:8100

export let env = {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  PORT: PORT,
  ORIGIN: process.env.ORIGIN,
  SESSION_SECRET: process.env.SESSION_SECRET || Math.random().toString(),
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  NODE_ENV: process.env.NODE_ENV || 'development',
}