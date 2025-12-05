import React, { useState, useRef, useEffect } from "react";
import {View,Text,TextInput,TouchableOpacity,StyleSheet,ScrollView,KeyboardAvoidingView,Platform,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {getBotResponse,BotMessage,QuickReply, aprenderFrase} from "@/utils/chatbotLogica";

function labelToIntent(label: string): string {
  const map: Record<string, string> = {
    "Modificar datos": "modificar_datos",
    "Cambiar contrasena": "cambiar_contraseña",
    "Problema de acceso": "problema_acceso",
    "Buscar servicio": "buscar_servicio",
    "Publicación": "publicacion",
    "Problema con publicación": "problema_publicacion",
    "Problema de ubicación": "problema_ubicacion",
    "Agradecimiento": "agradecimiento",
    "Despedida": "despedida",
    "Información general": "informacion_general",
  };
  return map[label] ?? "desconocido";
}
export default function ChatbotScreen() {
  const [messages, setMessages] = useState<BotMessage[]>([
    {
      from: "bot",
      text: "¡Hola! Soy Ofelia, la asistente de OficioYa. ¿En qué puedo ayudarte?",
    },
  ]);

  const [input, setInput] = useState("");
  const scrollRef = useRef<ScrollView | null>(null);

  // Guardamos el último mensaje del usuario para aprendizaje
  const lastUserMessage = useRef<string>("");

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Enviar mensaje normal
  const enviarMensaje = (texto: string) => {
    if (!texto.trim()) return;

    lastUserMessage.current = texto;

    const userMessage: BotMessage = {
      from: "user",
      text: texto,
    };

    const botReply = getBotResponse(texto);

    const botMessage: BotMessage = {
      from: "bot",
      text: botReply.text,
      suggestions: botReply.suggestions,
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
  };

  // Enviar mensaje del input
  const handleSend = () => {
    enviarMensaje(input);
    setInput("");
  };

  // Usuario toca una sugerencia (desambiguación o quick replies)
  const handleSuggestionPress = (s: QuickReply) => {
    const label = s.label;
    const selectedIntent = labelToIntent(label);

    // Aprendizaje ligero 
    if (selectedIntent !== "desconocido" && lastUserMessage.current.trim()) {
      aprenderFrase(selectedIntent, lastUserMessage.current.toLowerCase());
    }

    // Enviar el mensaje asociado al botón
    enviarMensaje(s.value);
  };

  // Último mensaje del bot (para mostrar sugerencias)
  const lastBotMessage = [...messages].reverse().find((m) => m.from === "bot");

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
        <Text style={styles.title}>Asistente Ofelia</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Mensajes */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={{ paddingVertical: 10 }}
        ref={scrollRef}
      >
        {messages.map((msg, i) => (
          <View
            key={i}
            style={[
              styles.messageBubble,
              msg.from === "user" ? styles.userBubble : styles.botBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                msg.from === "user" ? styles.userText : styles.botText,
              ]}
            >
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Quick Replies */}
      {lastBotMessage?.suggestions &&
        lastBotMessage.suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {lastBotMessage.suggestions.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={styles.suggestionChip}
                  onPress={() => handleSuggestionPress(s)}
                >
                  <Text style={styles.suggestionText}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

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
          <Ionicons name="send" size={20} color="#fff" />
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
    paddingVertical: 12,
    marginTop: 35,
    backgroundColor: "#FFF",
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

  messagesContainer: { flex: 1, paddingHorizontal: 16 },

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
    borderBottomRightRadius: 4,
  },

  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#01D89A",
    borderBottomLeftRadius: 4,
  },

  messageText: { fontSize: 14 },
  userText: { color: "#FFF" },
  botText: { color: "#FFF" },

  suggestionsContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  suggestionChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginRight: 8,
  },

  suggestionText: { fontSize: 16, color: "#0A1F57" },

  inputContainer: {
    flexDirection: "row",
    padding: 18,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  input: {
    flex: 1,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 7,
    maxHeight: 80,
    fontSize: 15,
  },

  sendButton: {
    backgroundColor: "#0A1F57",
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
});