declare global {
  namespace Express {
    interface Request {
      userId?: string
      role?: 'buyer' | 'vendor'
    }
  }
}

export {}
