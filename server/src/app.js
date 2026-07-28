import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import supabase from './config/supabase.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { apiLimiter, authLimiter, aiLimiter } from './middleware/rateLimiter.middleware.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Set security HTTP headers
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline scripts/styles for SPA dev mode
  crossOriginEmbedderPolicy: false
}));

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check (Bypasses rate limiting)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: 'supabase',
    supabaseConnected: !!supabase
  });
});

// Apply rate limiters
app.use('/api/auth', authLimiter);
app.use('/api/assistant', aiLimiter);
app.use('/api/health/symptoms', aiLimiter);
app.use('/api/health/report', aiLimiter);
app.use('/api', apiLimiter);

// Main API Routes
app.use('/api', routes);

// Serve static files from the React build (SPA support)
const distPath = path.join(__dirname, '../../client/dist');
app.use(express.static(distPath));

// Fallback to index.html for React Router
app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
