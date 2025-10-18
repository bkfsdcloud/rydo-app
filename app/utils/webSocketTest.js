import { Button } from '@react-navigation/elements';
import { useContext, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import AuthContext from '../context/AuthContext';
import { SOCKET_URL } from '../utils/constants';

export default function WebSocketTest() {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('Connecting...');
  const wsRef = useRef(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const ws = new WebSocket(SOCKET_URL, undefined,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }); 

    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Connected');
      setStatus('Connected');
      ws.send(JSON.stringify({ action: 'send', message: 'Hello from device' }));
    };

    ws.onmessage = (event) => {
      console.log('Received:', event.data);
      setMessages((prev) => [...prev, event.data]);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setStatus('Error');
    };

    ws.onclose = () => {
      console.log('Connection closed');
      setStatus('Closed');
    };

    // Cleanup on unmount
    return () => ws.close();
  }, []);

  const sendMessage = (message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      console.log('Sent:', message);
    } else {
      console.warn('WebSocket not connected');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Status: {status}</Text>
      {messages.map((msg, idx) => (
        <Text key={idx}>Message: {msg}</Text>
      ))}

      <Button
        title="Send Location Update"
        onPress={() =>
          sendMessage({
            action: 'track',
            latitude: 12.345,
            longitude: 77.456,
            ts: new Date().toISOString(),
          })
        }
      />
    </View>
  );
}
