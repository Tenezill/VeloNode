import dotenv from 'dotenv'
import { Pool } from 'pg'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing. Create backend/.env (see .env.example).')
}

/**
 * Neon (pooler) + serverless: keep pool small; adjust max for your traffic.
 * SSL: Neon requires TLS; rejectUnauthorized:false matches common Neon + dev setups.
 * Prefer verifying the server cert in production if you pin CAs.
 */
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.PGPOOL_MAX ?? 10),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
  ssl: { rejectUnauthorized: false },
})
