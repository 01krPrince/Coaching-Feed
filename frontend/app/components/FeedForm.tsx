"use client";
import { useState } from "react";

interface FeedFormProps {
  onSuccess?: () => void;
  backendUrl: string;
}

export default function FeedForm({ onSuccess, backendUrl }: FeedFormProps) {
  const [form, setForm] = useState({ title: "", content: "", author: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content || !form.author) return;
    setStatus("loading");
    
    try {
      const res = await fetch(`${backendUrl}/feed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      
      setForm({ title: "", content: "", author: "" });
      setStatus("success");
      if (onSuccess) onSuccess();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
      {["title", "author"].map((field) => (
        <div key={field} style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6, textTransform: "capitalize" }}>
            {field}
          </label>
          <input
            type="text"
            value={(form as any)[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            placeholder={`Enter ${field}`}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, outline: "none", boxSizing: "border-box" }}
          />
        </div>
      ))}

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
          Content
        </label>
        <textarea
          rows={4}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="What's happening in coaching today?"
          style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, outline: "none", boxSizing: "border-box", resize: "vertical" }}
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        style={{ width: "100%", background: "#4f46e5", color: "#fff", border: "none", padding: "12px", borderRadius: 8, cursor: "pointer", fontSize: 15, fontWeight: 600, transition: "background 0.2s" }}
      >
        {status === "loading" ? "Posting Update..." : "Broadcast to Feed"}
      </button>

      {status === "success" && <p style={{ color: "#16a34a", fontSize: 14, marginTop: 12, textAlign: "center", fontWeight: 500 }}>✅ Feed broadcasted successfully!</p>}
      {status === "error" && <p style={{ color: "#dc2626", fontSize: 14, marginTop: 12, textAlign: "center", fontWeight: 500 }}>❌ Failed to post. Check your server connection.</p>}
    </form>
  );
}