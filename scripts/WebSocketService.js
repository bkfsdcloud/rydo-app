import { SOCKET_URL } from "./constants";

// WebSocketService.js
class WebSocketService {
  static instance = null;
  socket = null;
  listeners = new Set();

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  connect = (token) => {
    if (this.socket) return;

    this.socket = new WebSocket(SOCKET_URL, undefined, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

    this.socket.onopen = () => {
      console.log('✅ WebSocket Connected');
    };

    this.socket.onmessage = (event) => {
      console.log(this.listeners);
      this.listeners.forEach((cb) => cb(event.data));
    };

    this.socket.onerror = (error) => {
      console.log('❌ WebSocket Error:', error.message);
    };

    this.socket.onclose = (e) => {
      console.log('⚠️ WebSocket Closed, retrying...');
      this.socket = null;
    //   setTimeout(() => this.connect(url), 3000); // auto reconnect
    };
  };

  send = (message) => {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('⚠️ WebSocket not connected. Message not sent.');
    }
  };

  addListener = (callback) => {
    this.listeners.add(callback);
  };

  removeListener = (callback) => {
    this.listeners.delete(callback);
  };
}

export default WebSocketService.getInstance();
