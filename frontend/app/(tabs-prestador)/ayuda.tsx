import React, { useState, useRef, useEffect } from "react";
import {View,Text,TextInput,TouchableOpacity,StyleSheet,ScrollView,KeyboardAvoidingView,Platform,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getBotResponse, BotMessage } from "@/utils/chatbotLogica"; 

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<BotMessage[]>([
    {
      from: "bot",
      text: "¡Hola! Soy Ofelia el asistente de OficioYa. Cuéntame, ¿en qué puedo ayudarte?",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<ScrollView | null>(null);

  // Para hacer scroll automático al final cuando haya nuevos mensajes
  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: BotMessage = { from: "user", text: trimmed };
    const botAnswer = getBotResponse(trimmed);
    const botMessage: BotMessage = { from: "bot", text: botAnswer };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0A1F57" />
        </TouchableOpacity>
        <Text style={styles.title}> Asistente Ofelia </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Chat */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={{ paddingVertical: 10 }}
        ref={scrollRef}
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.from === "user"
                ? styles.userBubble
                : styles.botBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                msg.from === "user"
                  ? styles.userText
                  : styles.botText,
              ]}
            >
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu duda..."
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 35,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#0A1F57",
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#0A1F57",
    borderBottomRightRadius: 2,
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E7EB",
    borderBottomLeftRadius: 2,
  },
  messageText: { fontSize: 14 },
  userText: { color: "#FFFFFF" },
  botText: { color: "#111827" },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  input: {
    flex: 1,
    maxHeight: 90,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    fontSize: 14,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#0A1F57",
    borderRadius: 999,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});