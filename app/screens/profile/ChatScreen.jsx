import { useRideStore } from "@/app/store/useRideStore";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AuthContext from "../../context/AuthContext";
import SocketContext from "../../context/SocketContext";

export default function ChatScreen() {
  const { sendMessage, addListener, removeListener } =
    useContext(SocketContext);
  const { user } = useContext(AuthContext);
  const { id } = useRideStore();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("offline");
  const flatListRef = useRef(null);

  useEffect(() => {
    addListener(handleMessage);
    return () => {
      removeListener(handleMessage);
    };
  }, []);

  const getColor = () => (status === "offline" ? "grey" : "green");

  const handleMessage = (parsed) => {
    console.log("📨 Message from server for live chat:", parsed);

    if (parsed.data) {
      if (parsed.data.rideId === id) {
        setMessages((prev) => [
          ...prev,
          {
            ...parsed.data,
            isMine: parsed.data.senderId === user?.id,
          },
        ]);
      }
    }
    if (parsed?.status) {
      setStatus(parsed?.status);
    }
  };

  useEffect(() => {
    // Load previous chat messages
    // fetch(`https://api.yourdomain.com/chat/${rideId}`)
    //   .then(res => res.json())
    //   .then(setMessages);
    // Listen to incoming chat messages
    // socket.on('sendMessage', (msg) => {
    //   if (msg.data.rideId === rideId) {
    //     setMessages((prev) => [...prev, {
    //       ...msg.data,
    //       isMine: msg.data.senderId === currentUserId
    //     }]);
    //   }
    // });
    // return () => socket.off('sendMessage');
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }
  }, [messages]);

  const sendMessageInt = () => {
    if (!text.trim()) return;

    const messageData = {
      event: "sendMessage",
      data: {
        rideId: id,
        message: text,
        senderRole: user?.role,
        senderId: user?.userId,
      },
    };

    sendMessage(messageData);

    setMessages((prev) => [...prev, { message: text, isMine: true }]);
    setText("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={{}}>
        <View style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            data={messages}
            style={{
              height: 250,
            }}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View
                style={{
                  alignSelf: item.isMine ? "flex-end" : "flex-start",
                  backgroundColor: item.isMine ? "#007AFF" : "#f1f1f1",
                  borderRadius: 12,
                  padding: 10,
                  margin: 8,
                  maxWidth: "75%",
                }}
              >
                <Text style={{ color: item.isMine ? "#fff" : "#000" }}>
                  {!item.isMine && (
                    <Ionicons
                      name="radio-button-on-outline"
                      size={16}
                      color={getColor()}
                    ></Ionicons>
                  )}
                  {item.isMine ? "You" : item?.from}: {item.message}
                </Text>
              </View>
            )}
          />
        </View>

        {/* Input area */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            padding: 10,
            borderTopWidth: 1,
            borderColor: "#eee",
          }}
        >
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 20,
              paddingHorizontal: 15,
              paddingVertical: 8,
              marginRight: 10,
            }}
            value={text}
            onChangeText={setText}
            placeholder="Type a message"
          />
          <TouchableOpacity
            onPress={sendMessageInt}
            style={{
              backgroundColor: "#007AFF",
              paddingHorizontal: 18,
              paddingVertical: 10,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: "#fff" }}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
