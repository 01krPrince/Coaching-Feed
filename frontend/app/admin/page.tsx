"use client";
import Link from "next/link";
import FeedForm from "../components/FeedForm";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function AdminPage() {
  return (
    <main style={{ maxWidth: 480, margin: "40px auto", padding: "0 16px" }}>
      <div style={{ marginBottom: 20 }}>
        <Link href="/" style={{ fontSize: 14, color: "#4f46e5", textDecoration: "none", fontWeight: 500 }}>
          ← Back to Coaching Feed
        </Link>
      </div>

      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Add Feed (Admin)</h1>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>Publish global updates instantly across live dashboards.</p>

      <FeedForm backendUrl={BACKEND_URL} />
    </main>
  );
}