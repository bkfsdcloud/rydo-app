// SocketContext.js
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { SOCKET_URL } from "../../scripts/constants";
import AuthContext from "./AuthContext";
import LocationContext from "./LocationContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const listenersRef = useRef(new Set());
  const [connected, setConnected] = useState(false);
  const { token, user } = useContext(AuthContext);
  const { location } = useContext(LocationContext);

  useEffect(() => {
    console.log("token: ", token);
    let socket = null;
    if (token && !socketRef.current) {
      socket = connectSocket();
    }

    return () => {
      console.log("🔌 Cleaning up WebSocket");
      socket?.close();
      socketRef.current = null;
    };
  }, [token]);

  const connectSocket = () => {
    console.log("🌐 Connecting WebSocket For ", user?.name);
    const socket = new WebSocket(SOCKET_URL, undefined, {
      headers: { Authorization: `Bearer ${token}` },
    });

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket Connected For ", user?.name);
      setConnected(true);

      // 🔥 Send initial registration info
      if (user?.role === "DRIVER") {
        socket.send(
          JSON.stringify({
            event: "onLocationUpdate",
            driverLocation: {
              lat: location.lat,
              lng: location.lng,
            },
            details: {
              status: user?.driver?.available || "ACTIVE",
              vehicleType: "car",
              category: "standard",
            },
          })
        );
      }
    };

    socket.onmessage = (event) => {
      const parsedEvent = typeof event === "string" ? JSON.parse(event) : event;
      const parsedData =
        typeof parsedEvent?.data === "string"
          ? JSON.parse(parsedEvent?.data)
          : parsedEvent?.data;
      listenersRef.current.forEach((cb) => cb(parsedData));
    };

    socket.onerror = (err) => {
      console.log("❌ WebSocket Error:", err);
    };

    socket.onclose = () => {
      console.log("⚠️ WebSocket Closed For ", user?.name);
      setConnected(false);
      socketRef.current = null;
      // setTimeout(connectSocket, 5000);
    };

    return socket;
  };

  const disconnect = () => {
    console.log("🔌 Disconnect WebSocket manually");
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  };

  const sendMessage = (message) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn(
        "⚠️ WebSocket not connected, message not sent : ",
        user?.name
      );
    }
  };

  const addListener = (cb) => listenersRef.current.add(cb);
  const removeListener = (cb) => listenersRef.current.delete(cb);

  return (
    <SocketContext.Provider
      value={{
        connected,
        disconnect,
        sendMessage,
        addListener,
        removeListener,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
