const express      = require('express');
const mongoose     = require('mongoose');
const cors         = require('cors');
const helmet       = require('helmet');
const compression  = require('compression');
const cookieParser = require('cookie-parser');
const http         = require('http');
const rateLimit    = require('express-rate-limit');
require('dotenv').config();

// ── Step 1: Validate env vars before anything else ────────────────────────────
const validateEnv = require('./utils/validateEnv');
validateEnv();

const { initSocket }   = require('./utils/socket');
const errorHandler     = require('./middleware/errorHandler');

const app    = express();
const server = http.createServer(app);

// ── Trust Proxy for Rate Limiting behind Render ───────────────────────────────
app.set('trust proxy', 1);

initSocket(server);

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow Cloudinary image embeds
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Compression ──────────────────────────────────────────────────────────────
// Gzip all responses > 1KB — reduces payload size by 70-85%
app.use(compression({ threshold: 1024 }));

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ── Rate Limiting ─────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', globalLimiter); // apply to all API routes

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 requests per 15 minutes for auth
  message: { success: false, message: 'Too many authentication attempts, please try again later' }
});

// ── Database ──────────────────────────────────────────────────────────────────
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in .env — server cannot start');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, { family: 4 })
  .then(() => console.log('✅ Connected to MongoDB — Elevate Placement Tracker'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// ── Redis (optional — app works without it) ──────────────────────────────────
const { getRedis } = require('./utils/redisClient');
getRedis(); // Initialize connection (non-blocking)

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    env: process.env.NODE_ENV || 'development',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',          authLimiter, require('./routes/auth'));
app.use('/api/user',          require('./routes/user'));
app.use('/api/student',       require('./routes/student'));
app.use('/api/practice',      require('./routes/practice'));
app.use('/api/tpo',           require('./routes/tpo'));
app.use('/api/superadmin',    require('./routes/superadmin'));
app.use('/api/admin',         require('./routes/admin'));
app.use('/api/company',       require('./routes/company'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/proxy',         require('./routes/proxy'));
app.use('/api',               require('./routes/chat'));          // /api/chat, /api/health (chat)
app.use('/api/stats',         require('./routes/stats'));

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global error handler (MUST be last) ──────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Elevate server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
