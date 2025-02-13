"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { WS_URL } from "../app/config";
import { useAuth } from "@/lib/auth";
export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket>();
  const { token } = useAuth();
  useEffect(() => {
    try {
      const ws = new WebSocket(`${WS_URL}?token=${token}`);
      ws.onopen = () => {
        setLoading(false);
        setSocket(ws);
      };
    } catch (e) {
      if (e instanceof Error) {
        throw new Error("Error in websocket connection.");
      }
    }
  }, []);

  return {
    socket,
    setLoading,
    loading,
  };
}
