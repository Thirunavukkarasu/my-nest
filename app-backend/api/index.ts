import express from 'express';
import { authenticateToken } from '../src/middleware/auth';
import flatsRouter from '../src/routes/flats';
import ledgerRouter from '../src/routes/ledger';
import loginRouter from '../src/routes/login';
import registerRouter from '../src/routes/register';
import residentsRouter from '../src/routes/residents';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'API is running successfully'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Public routes (no authentication required)
app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);

// Protected routes (authentication required)
app.use('/api/flats', authenticateToken, flatsRouter);
app.use('/api/residents', authenticateToken, residentsRouter);
app.use('/api/ledger', authenticateToken, ledgerRouter);

// For Vercel serverless functions (production), export the app (Vercel handles HTTP)
// For local development (`pnpm dev` or `vc dev`), start the server
// 
// How it works:
// - `pnpm dev`: Runs directly → server starts on port 3000
// - `vc dev`: Runs directly → server starts, Vercel proxies to it
// - Production: Module imported → no server, Vercel handles HTTP
//
// Note: `VERCEL=1` is only set in production, not during `vc dev`
// Check if we're in a Bun environment and not in Vercel production
// Use a type assertion for import.meta.main (Bun-specific)
const isMain = (import.meta as any).main;
if (isMain && typeof Bun !== 'undefined' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 API available at http://localhost:${PORT}/api`);
  });
}

export default app;

