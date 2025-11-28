// SocketContext.js
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { SOCKET_URL, STAGE } from "../../scripts/constants";
import AuthContext from "./AuthContext";
import LocationContext from "./LocationContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const listenersRef = useRef(new Set());
  const retryCountRef = useRef(0);
  const shouldRetryRef = useRef(true);
  const [connected, setConnected] = useState(false);

  const { token, user } = useContext(AuthContext);
  const { location } = useContext(LocationContext);

  const MAX_RETRIES = 5;

  useEffect(() => {
    console.log("token:", token);

    if (token) {
      shouldRetryRef.current = true; // allow retry only if user is logged in
      connectSocket();
    } else {
      disconnectSocket(); // no retry when logged out
    }

    return () => {
      disconnectSocket();
    };
  }, [token]);

  const connectSocket = () => {
    if (!token) return;
    if (socketRef.current) return; // avoid duplicate sockets

    console.log("🌐 Connecting WebSocket for", user?.name);

    const socket = new WebSocket(SOCKET_URL + STAGE, undefined, {
      headers: { Authorization: `Bearer ${token}` },
    });

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket Connected for", user?.name);
      setConnected(true);

      retryCountRef.current = 0; // RESET retry count on successful connection

      // Driver registers initial location
      if (user?.role === "DRIVER") {
        console.log("user: ", user);
        socket.send(
          JSON.stringify({
            event: "onLocationUpdate",
            driverLocation: {
              lat: location.lat,
              lng: location.lng,
            },
            details: {
              status: user?.driver?.status || "ACTIVE",
              vehicleType: user?.driver?.vehicle?.type,
              category: user?.driver?.vehicle?.category,
            },
          })
        );
      }
    };

    socket.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      listenersRef.current.forEach((cb) => cb(parsed));
    };

    socket.onerror = (err) => {
      console.log("❌ WebSocket Error:", err.message);
    };

    socket.onclose = () => {
      console.log("⚠️ WebSocket Closed for", user?.name);
      setConnected(false);
      socketRef.current = null;

      // 🔥 Stop retry when logout
      if (!shouldRetryRef.current) {
        console.log("⛔ Retry stopped because user logged out");
        return;
      }

      // 🔥 Stop retry after MAX retries
      if (retryCountRef.current >= MAX_RETRIES) {
        console.log("❌ Max retries reached. Stopping WebSocket reconnect.");
        return;
      }

      retryCountRef.current++;
      console.log(`♻️ Retrying WebSocket... (${retryCountRef.current}/5)`);

      setTimeout(connectSocket, 5000); // retry after 5 sec
    };
  };

  const disconnectSocket = () => {
    shouldRetryRef.current = false;
    retryCountRef.current = 0;

    console.log("🔌 Manually disconnecting WebSocket");

    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  };

  const sendMessage = (message) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("⚠️ WebSocket not connected, message not sent");
    }
  };

  const addListener = (cb) => {
    if (!listenersRef.current.has(cb)) listenersRef.current.add(cb);
  };
  const removeListener = (cb) => listenersRef.current.delete(cb);

  return (
    <SocketContext.Provider
      value={{
        connected,
        disconnect: disconnectSocket,
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
