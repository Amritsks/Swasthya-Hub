import { useEffect, useRef } from "react";
import { io } from "socket.io-client";


export default function useSocket(userId) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    // Use VITE_API_URL environment variable or fallback to localhost
    const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const socket = io(SOCKET_URL, { autoConnect: false });

    socketRef.current = socket;

    // Manually connect after initialization
    socket.connect();

    socket.on('connect', () => {
      socket.emit('identify', { userId });
      console.log(`Socket connected with id ${socket.id}`);
    });

    // Optional: handle reconnect attempts
    socket.io.on('reconnect_attempt', () => {
      console.log('Attempting to reconnect to socket server...');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId]);

  return socketRef;
}
