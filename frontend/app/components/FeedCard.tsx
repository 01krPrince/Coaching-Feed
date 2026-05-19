import { useEffect, useState } from "react";

type Feed = {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
};

export default function FeedCard({ feed }: { feed: Feed }) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    // Only runs on the client browser, preventing hydration mismatch
    setFormattedDate(new Date(feed.createdAt).toLocaleString());
  }, [feed.createdAt]);

  return (
    <div style={{
      border: "1px solid #e5e7eb",
      borderRadius: 10,
      padding: "16px 20px",
      marginBottom: 12,
      background: "#fff"
    }}>
      <h3 style={{ margin: 0, fontSize: 16 }}>{feed.title}</h3>
      <p style={{ color: "#555", margin: "6px 0" }}>{feed.content}</p>
      <small style={{ color: "#999" }}>
        By {feed.author} · {formattedDate || "Loading date..."}
      </small>
    </div>
  );
}