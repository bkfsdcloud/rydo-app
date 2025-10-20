import { Button } from '@react-navigation/elements';
import { useContext, useEffect, useRef, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SOCKET_URL } from '../../scripts/constants';
import AuthContext from '../context/AuthContext';
import { LocationContext } from '../context/LocationContext';

export default function WebSocketTest() {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('Connecting...');
  const wsRef = useRef(null);
  const { token } = useContext(AuthContext);

  const { location, refresh } = useContext(LocationContext);

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
      ws.send(JSON.stringify({ action: 'init', coordinate: { lat: location?.latitude, lng: location?.longitude}, message: 'Driver logged in' }));
    };

    ws.onmessage = (event) => {
      console.log('Received:', event.data);
      Alert.alert('Notification', event.data);
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
      {/* <Text>Status: {status}</Text>
      {messages.map((msg, idx) => (
        <Text key={idx}>Message: {msg}</Text>
      ))} */}

      <Button
        title="Send Location Update"
         style={{
          alignSelf: 'center',
          backgroundColor: '#007AFF',
          padding: 15,
          borderRadius: 10,
        }}
        onPress={() =>
          sendMessage({
            action: 'track',
            coordinate: { lat: location?.latitude, lng: location?.longitude}
          })
        }
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Ping</Text>
        </Button>
    </View>
  );
}
