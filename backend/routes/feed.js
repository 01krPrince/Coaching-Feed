const express  = require("express");
const router   = express.Router();
const { v4: uuidv4 } = require("uuid");
const Feed     = require("../models/Feed");
const { getCache, setCache, deleteCache } = require("../cache/redis");
const { getIO } = require("../socket/index");

const CACHE_KEY = "feed:all";

// GET /feed → Redis first, then DB fallback
router.get("/", async (req, res) => {
  try {
    // 1. Check Redis cache
    const cached = await getCache(CACHE_KEY);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      console.log("⚡ Cache HIT — Returning cached data");
      return res.json(cached);
    }

    // 2. Cache miss ya flat cache → query from DB
    console.log("🔍 Cache MISS — querying MongoDB");
    const feeds = await Feed.find().sort({ createdAt: -1 });

    // 3. Cache only if we have records
    if (feeds.length > 0) {
      await setCache(CACHE_KEY, feeds, 60);
    }

    return res.json(feeds);
  } catch (err) {
    console.error("❌ GET Feed route error:", err);
    return res.status(500).json({ error: "Failed to fetch feeds" });
  }
});

// POST /feed
router.post("/", async (req, res) => {
  try {
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({ error: "title, content and author are required" });
    }

    // 1. Save to MongoDB
    const feed = await Feed.create({ title, content, author });
    console.log("💾 Saved successfully to Database:", feed._id);

    // 2. Invalidate cache layer inside try/catch to safeguard response execution
    try {
      await deleteCache(CACHE_KEY);
    } catch (cacheErr) {
      console.error("⚠️ Cache deletion failed silently, passing through:", cacheErr.message);
    }

    // 3. Emit realtime event to ALL connected clients
    try {
      const io = getIO();
      const clientPayload = { ...feed.toObject(), eventId: uuidv4() };
      io.emit("new_feed", clientPayload);
      console.log("⚡ Realtime notification emitted on websockets successfully!");
    } catch (socketErr) {
      console.error("⚠️ Socket.IO broadcast dropped:", socketErr.message);
    }

    // Return final success response immediately to stop endless loading spinner on frontend
    return res.status(201).json(feed);
  } catch (err) {
    console.error("❌ POST Feed route error:", err);
    return res.status(500).json({ error: "Failed to create feed" });
  }
});

module.exports = router;