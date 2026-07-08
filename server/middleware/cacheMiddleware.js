const { getRedis, isRedisReady } = require('../utils/redisClient');

/**
 * Express middleware that caches JSON responses in Redis.
 *
 * Drop it into any route — zero controller changes needed.
 *
 * @param {string}   keyPrefix  - Cache key prefix (e.g. 'stats', 'tpo-dash')
 * @param {number}   [ttl=300]  - TTL in seconds (default 5 minutes)
 * @param {Function} [keyFn]    - Optional function(req) => string for dynamic keys.
 *                                If not provided, uses req.originalUrl.
 *
 * @example
 *   // Simple: cache by URL for 10 minutes
 *   router.get('/public', cacheResponse('stats', 600), getPublicStats);
 *
 *   // Per-user: cache by userId for 5 minutes
 *   router.get('/dashboard', auth, cacheResponse('tpo-dash', 300,
 *     (req) => req.user._id.toString()
 *   ), getDashboardStats);
 */
const cacheResponse = (keyPrefix, ttl = 300, keyFn = null) => {
  return async (req, res, next) => {
    const client = getRedis();

    // Redis not available → skip caching, proceed normally
    if (!client || !isRedisReady()) return next();

    // Build cache key
    const suffix = keyFn ? keyFn(req) : req.originalUrl;
    const key = `${keyPrefix}:${suffix}`;

    // Check cache
    try {
      const cached = await client.get(key);
      if (cached) {
        console.log(`[CACHE HIT]  ${key}`);
        return res.json(JSON.parse(cached));
      }
    } catch (err) {
      // Redis error → just skip cache and continue
      console.warn(`[CACHE MW READ ERROR] ${key}:`, err.message);
      return next();
    }

    console.log(`[CACHE MISS] ${key}`);

    // Intercept res.json() to cache the response before sending
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        client.setex(key, ttl, JSON.stringify(body)).catch((err) => {
          console.warn(`[CACHE MW WRITE ERROR] ${key}:`, err.message);
        });
      }
      return originalJson(body);
    };

    next();
  };
};

module.exports = { cacheResponse };
