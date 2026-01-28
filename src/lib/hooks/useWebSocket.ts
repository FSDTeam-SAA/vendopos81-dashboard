"use client";

import { useEffect, useState, useRef } from "react";
import { createSocket } from "../websocket/socket";

export function useWebSocket(userId?: string) {
    const socketRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const ws = createSocket(userId);
        socketRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket connected");
            setIsConnected(true);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setMessage(data);
            } catch (error) {
                console.error("WebSocket message parsing error:", error);
                setMessage(event.data);
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.onclose = () => {
            console.log("WebSocket disconnected");
            setIsConnected(false);
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close();
            }
            socketRef.current = null;
        };
    }, [userId]);

    return { isConnected, message };
}