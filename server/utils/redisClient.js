const Redis = require('ioredis');

// ── Singleton Redis connection ────────────────────────────────────────────────

let redis = null;
let isConnected = false;

/**
 * Get (or create) the Redis client singleton.
 * Connects lazily on first call. If REDIS_URL is not set, returns null.
 */
const getRedis = () => {
  if (redis) return redis;

  const url = process.env.REDIS_URL;
  if (!url) {
    console.warn('⚠️  REDIS_URL not set — caching disabled');
    return null;
  }

  redis = new Redis(url, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      if (times > 3) {
        // Stop retrying silently — app works without Redis
        return null;
      }
      return Math.min(times * 500, 2000);
    },
    lazyConnect: true,
  });

  let errorLogged = false;
  redis.on('connect', () => {
    isConnected = true;
    errorLogged = false;
    console.log('✅ Redis connected');
  });
  redis.on('ready', () => { isConnected = true; });
  redis.on('error', (err) => {
    isConnected = false;
    if (!errorLogged) {
      console.warn('⚠️  Redis unavailable:', err.message, '— caching disabled');
      errorLogged = true;
    }
  });
  redis.on('close', () => { isConnected = false; });

  // Attempt connection (non-blocking)
  redis.connect().catch(() => {
    // Silently handled by error event above
  });

  return redis;
};

/**
 * Check if Redis is currently connected and usable.
 */
const isRedisReady = () => isConnected && redis !== null;

// ── Cache helpers ─────────────────────────────────────────────────────────────

/**
 * Cache-aside pattern: check Redis first, fall back to the provided function.
 *
 * @param {string}   key           - Unique cache key
 * @param {Function} fn            - Async function that fetches fresh data
 * @param {number}   [ttlSeconds]  - Time-to-live in seconds (default 300 = 5 min)
 * @returns {*}                    - Cached or freshly-fetched data
 */
const cacheOrFetch = async (key, fn, ttlSeconds = 300) => {
  const client = getRedis();

  // Redis unavailable → just run the function directly
  if (!client || !isRedisReady()) return fn();

  try {
    const cached = await client.get(key);
    if (cached) {
      console.log(`[CACHE HIT]  ${key}`);
      return JSON.parse(cached);
    }
  } catch (err) {
    console.warn(`[CACHE READ ERROR] ${key}:`, err.message);
  }

  // Cache miss → fetch from DB
  console.log(`[CACHE MISS] ${key}`);
  const result = await fn();

  // Store in Redis (fire-and-forget, don't block the response)
  try {
    await client.setex(key, ttlSeconds, JSON.stringify(result));
  } catch (err) {
    console.warn(`[CACHE WRITE ERROR] ${key}:`, err.message);
  }

  return result;
};

/**
 * Invalidate all Redis keys matching a glob pattern.
 * E.g. invalidateByPattern('stats:*') clears stats:public, stats:overview, etc.
 *
 * @param {string} pattern - Glob pattern (e.g. 'tpo:dash:*')
 */
const invalidateByPattern = async (pattern) => {
  const client = getRedis();
  if (!client || !isRedisReady()) return;

  try {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
      console.log(`[CACHE INVALIDATED] ${keys.length} key(s) matching "${pattern}"`);
    }
  } catch (err) {
    console.warn(`[CACHE INVALIDATE ERROR] ${pattern}:`, err.message);
  }
};

/**
 * Invalidate one or more specific cache keys.
 *
 * @param {...string} keys - Cache keys to delete
 */
const invalidateKeys = async (...keys) => {
  const client = getRedis();
  if (!client || !isRedisReady()) return;

  try {
    const existing = [];
    for (const key of keys) {
      const exists = await client.exists(key);
      if (exists) existing.push(key);
    }
    if (existing.length > 0) {
      await client.del(...existing);
      console.log(`[CACHE INVALIDATED] keys: ${existing.join(', ')}`);
    }
  } catch (err) {
    console.warn(`[CACHE INVALIDATE ERROR]:`, err.message);
  }
};

module.exports = {
  getRedis,
  isRedisReady,
  cacheOrFetch,
  invalidateByPattern,
  invalidateKeys,
};
