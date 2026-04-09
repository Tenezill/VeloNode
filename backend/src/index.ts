import { pool } from './config/db.js'
import cors from 'cors'
import express from 'express'
import authRoutes from './routes/auth.routes.js'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is missing. Add it to backend/.env (see .env.example).')
}

const app = express()
const PORT = Number(process.env.PORT) || 3001

const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:3000'
app.use(
  cors({
    origin: corsOrigin === '*' ? true : corsOrigin.split(',').map((o) => o.trim()),
    credentials: true,
  }),
)
app.use(express.json())

app.get('/api/health', async (_req, res) => {
  try {
    const result = await pool.query<{ now: string }>('SELECT NOW() AS now')
    const row = result.rows[0]
    console.log('[api/health] database:', row)
    res.json({ ok: true, database: true, now: row?.now })
  } catch (err) {
    console.error('[api/health] database error:', err)
    res.status(503).json({
      ok: false,
      database: false,
      error: 'database_unavailable',
    })
  }
})

app.use('/api/auth', authRoutes)

const server = app.listen(PORT, () => {
  console.log(`VeloNode API listening on http://localhost:${PORT}`)
  console.log(`CORS allowed origin(s): ${corsOrigin}`)
})

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use. Stop the other process or set PORT in backend/.env.`,
    )
  } else {
    console.error(err)
  }
  process.exit(1)
})
