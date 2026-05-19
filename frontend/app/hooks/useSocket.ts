import { useEffect, useRef } from "react";
import { socket } from "../lib/socket";

export function useSocket(onNewFeed: (feed: any) => void) {
  const seenIds = useRef<Set<string>>(new Set()); // dedup tracker

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    socket.on("reconnect", (attempt) => {
      console.log(`🔁 Reconnected after ${attempt} attempts`);
    });

    socket.on("new_feed", (feed) => {
      // BONUS: prevent duplicate events
      if (seenIds.current.has(feed._id)) return;
      seenIds.current.add(feed._id);
      onNewFeed(feed);
    });

    return () => {
      socket.off("new_feed");
      socket.disconnect();
    };
  }, []);
}