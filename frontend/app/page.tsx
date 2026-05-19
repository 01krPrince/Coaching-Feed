"use client";
import { useEffect, useState } from "react";
import FeedCard from "./components/FeedCard";
import { useSocket } from "./hooks/useSocket";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function HomePage() {
  const [feeds, setFeeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load initial feeds from API
  useEffect(() => {
    console.log("🌐 Fetching initial feeds from:", `${BACKEND_URL}/feed`);
    
    fetch(`${BACKEND_URL}/feed`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
        return r.json();
      })
      .then((data) => {
        console.log("📥 Feeds successfully loaded from backend:", data);
        setFeeds(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
        setError(`Failed to load feeds: ${err.message || err}`);
        setLoading(false);
      });
  }, []);

  // Realtime: prepend new feed without refresh
  useSocket((newFeed) => {
    console.log("⚡ Realtime event received on frontend:", newFeed);
    setFeeds((prev) => [newFeed, ...prev]);
  });

  return (
    <main style={{ maxWidth: 640, margin: "40px auto", padding: "20px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111827", margin: 0 }}>Coaching Feed</h1>
        <span style={{ fontSize: 12, padding: "4px 8px", borderRadius: 12, backgroundColor: "#e0f2fe", color: "#0369a1", fontWeight: 600 }}>
          Live Connected
        </span>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#6b7280" }}>
          🔄 Loading feeds from server...
        </div>
      )}
      
      {error && (
        <div style={{ padding: "12px 16px", backgroundColor: "#fef2f2", border: "1px solid #fee2e2", borderRadius: 8, color: "#991b1b", marginBottom: 16 }}>
          {error}
        </div>
      )}

      {!loading && feeds.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", border: "2px dashed #e5e7eb", borderRadius: 12, backgroundColor: "#fff" }}>
          <p style={{ color: "#4b5563", margin: "0 0 8px 0", fontWeight: 500 }}>No feeds found</p>
          <p style={{ color: "#9ca3af", margin: 0, fontSize: 14 }}>Go to the Admin panel to publish your first post.</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {feeds.map((feed) => (
          <FeedCard key={feed._id || Math.random().toString()} feed={feed} />
        ))}
      </div>
    </main>
  );
}