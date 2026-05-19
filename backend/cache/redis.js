const { createClient } = require("redis");

const client = createClient({ 
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 2) {
        return new Error("Redis connection abandoned after 2 attempts");
      }
      return 1000;
    }
  }
});

let isRedisConnected = false;

client.on("error", (err) => {
  // Silent console logs taaki endless looping se terminal kharab na ho
});

client.on("connect", () => {
  console.log("✅ Redis connected");
  isRedisConnected = true;
});

const connectRedis = async () => {
  if (isRedisConnected && client.isOpen) return true;
  try {
    await client.connect();
    isRedisConnected = true;
    return true;
  } catch (err) {
    isRedisConnected = false;
    return false;
  }
};

// Get cached value
const getCache = async (key) => {
  if (!isRedisConnected) return null;
  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    return null;
  }
};

// Set cache with TTL (seconds)
const setCache = async (key, value, ttl = 60) => {
  if (!isRedisConnected) return;
  try {
    await client.setEx(key, ttl, JSON.stringify(value));
  } catch (err) {
    // catch silently
  }
};

// Delete cache key (invalidate)
const deleteCache = async (key) => {
  if (!isRedisConnected) return;
  try {
    await client.del(key);
    console.log(`🧹 Cache cleared for key: ${key}`);
  } catch (err) {
    // catch silently
  }
};

// Initial non-blocking connection attempt check
connectRedis().then((success) => {
  if(!success) console.log("⚠️ Redis local server check skipped (Using Direct MongoDB mode)");
});

module.exports = { getCache, setCache, deleteCache };