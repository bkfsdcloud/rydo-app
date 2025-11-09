import { SOCKET_URL } from "./constants";

// WebSocketService.js
class WebSocketService {
  static instance = null;
  socket = null;
  listeners = new Set();

  static getInstance() {
    if (!WebSocketService.instance) {
        console.log('Websocket instance created')
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  connect = (token, defMessage) => {
    if (this.socket) return;

    this.socket = new WebSocket(SOCKET_URL, undefined, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

    this.socket.onopen = () => {
      console.log('✅ WebSocket Connected');
      this.socket.send(JSON.stringify(defMessage));
    };

    this.socket.onmessage = (event) => {
      console.log(this.listeners.size);
      this.listeners.forEach((cb) => cb(event.data));
    };

    this.socket.onerror = (error) => {
      console.log('❌ WebSocket Error:', error.message);
    };

    this.socket.onclose = (e) => {
      console.log('⚠️ WebSocket Closed, retrying...');
      this.socket = null;
      // setTimeout(() => this.connect(SOCKET_URL), 3000); // auto reconnect
    };
  };

  disconnect = () => {
    if (this.socket) {
      console.log('🔌 Closing WebSocket connection');
      this.socket.close();
      this.socket = null;
    }
  };

  send = (message) => {
    console.log('Removing listener')
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('⚠️ WebSocket not connected. Message not sent.');
    }
  };

  addListener = (callback) => {
    console.log('Adding listener')
    this.listeners.add(callback);
  };

  removeListener = (callback) => {
    console.log('Removing listener')
    this.listeners.delete(callback);
  };
}

export default WebSocketService.getInstance();
