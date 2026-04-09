import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pool } from '../config/db.js'
import { isUserRole } from '../constants/roles.js'
import { checkEuVat, normalizeEuVat } from '../utils/checkEuVat.js'

const BCRYPT_ROUNDS = 12
const JWT_EXPIRES = '24h'

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not configured')
  }
  return secret
}

function issueToken(userId: string, role: 'buyer' | 'vendor'): string {
  return jwt.sign({ userId, role }, getJwtSecret(), { expiresIn: JWT_EXPIRES })
}

type UserRow = {
  id: string
  email: string
  role: 'buyer' | 'vendor'
  password_hash: string
}

export async function register(req: Request, res: Response): Promise<void> {
  const { email: rawEmail, password, role, vatNumber: rawVat, companyName: rawCompany } = req.body as {
    email?: string
    password?: string
    role?: string
    vatNumber?: string
    companyName?: string
  }

  const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : ''
  const companyNameTrimmed =
    typeof rawCompany === 'string' ? rawCompany.trim() : ''

  if (!email || !password || typeof password !== 'string') {
    res.status(400).json({ error: 'validation_error', message: 'email and password are required' })
    return
  }
  if (!companyNameTrimmed) {
    res.status(400).json({ error: 'validation_error', message: 'companyName is required' })
    return
  }
  if (password.length < 8) {
    res.status(400).json({ error: 'validation_error', message: 'password must be at least 8 characters' })
    return
  }
  if (!isUserRole(role)) {
    res.status(400).json({ error: 'validation_error', message: 'role must be buyer or vendor' })
    return
  }

  let normalizedBuyerVat: string | undefined
  let resolvedCompanyName = companyNameTrimmed

  if (role === 'buyer') {
    const vatStr = typeof rawVat === 'string' ? rawVat.trim() : ''
    if (!vatStr) {
      res.status(400).json({ error: 'validation_error', message: 'vatNumber is required for buyers' })
      return
    }
    const vatResult = await checkEuVat(vatStr)
    if (!vatResult.isValid) {
      res.status(400).json({
        error: 'vat_invalid',
        message: vatResult.error ?? 'VAT number could not be validated.',
      })
      return
    }
    normalizedBuyerVat = normalizeEuVat(vatStr)
    resolvedCompanyName = vatResult.companyName ?? companyNameTrimmed
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS)
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const insertUser = await client.query<UserRow>(
      `INSERT INTO users (email, password_hash, role)
       VALUES ($1, $2, $3)
       RETURNING id::text AS id, email, role, password_hash`,
      [email, passwordHash, role],
    )

    const row = insertUser.rows[0]
    if (!row) {
      await client.query('ROLLBACK')
      res.status(500).json({ error: 'server_error', message: 'Failed to create user' })
      return
    }

    if (role === 'buyer') {
      await client.query(`INSERT INTO buyer_profiles (user_id) VALUES ($1)`, [row.id])
    } else {
      await client.query(`INSERT INTO vendor_profiles (user_id) VALUES ($1)`, [row.id])
    }

    await client.query('COMMIT')

    const token = issueToken(row.id, row.role)
    res.status(201).json({
      token,
      user: {
        id: row.id,
        email: row.email,
        role: row.role,
        companyName: resolvedCompanyName,
        ...(normalizedBuyerVat ? { vatNumber: normalizedBuyerVat } : {}),
      },
    })
  } catch (err: unknown) {
    await client.query('ROLLBACK')
    const pg = err as { code?: string }
    if (pg.code === '23505') {
      res.status(409).json({ error: 'conflict', message: 'Email is already registered' })
      return
    }
    if (pg.code === '42P01' || pg.code === '42703') {
      console.error('[auth/register] schema mismatch — check users / profile tables:', err)
      res.status(500).json({
        error: 'schema_error',
        message:
          'Database schema mismatch. Expected tables: users (id, email, password_hash, role), buyer_profiles (user_id), vendor_profiles (user_id).',
      })
      return
    }
    console.error('[auth/register]', err)
    res.status(500).json({ error: 'server_error', message: 'Registration failed' })
  } finally {
    client.release()
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email: rawEmail, password } = req.body as { email?: string; password?: string }
  const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : ''

  if (!email || !password || typeof password !== 'string') {
    res.status(400).json({ error: 'validation_error', message: 'email and password are required' })
    return
  }

  try {
    const result = await pool.query<UserRow>(
      `SELECT id::text AS id, email, role, password_hash
       FROM users
       WHERE email = $1
       LIMIT 1`,
      [email],
    )

    const row = result.rows[0]
    if (!row) {
      res.status(401).json({ error: 'Unauthorized', message: 'Invalid email or password' })
      return
    }

    const ok = await bcrypt.compare(password, row.password_hash)
    if (!ok) {
      res.status(401).json({ error: 'Unauthorized', message: 'Invalid email or password' })
      return
    }

    const token = issueToken(row.id, row.role)
    res.json({
      token,
      user: { id: row.id, email: row.email, role: row.role },
    })
  } catch (err) {
    console.error('[auth/login]', err)
    res.status(500).json({ error: 'server_error', message: 'Login failed' })
  }
}
