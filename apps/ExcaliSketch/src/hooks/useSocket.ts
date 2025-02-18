"use client";
import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";
import { useAuth } from "@/lib/auth";

export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log("WebSocket connected, sending auth message...");
      ws.send(JSON.stringify({ type: "auth", token }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.error) {
          console.error("WebSocket authentication failed:", data.error);
          ws.close();
          setLoading(false);
          return;
        }

        if (data.msg === "Authenticated successfully") {
          console.log("WebSocket authenticated");
          setSocket(ws);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
      setSocket(null);
      setLoading(false);
    };

    return () => {
      ws.close();
    };
  }, [token]);

  return { socket, loading, setLoading };
}
