import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import QRCode from "react-native-qrcode-svg"; //descargar paquete: npm install react-native-svg@15.12.1
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";

export default function MostrarQRScreen() {
  const { user } = useAuth();

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#0A1F57" />
          </TouchableOpacity>
          <Text style={styles.title}>Mi Código QR</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.centerBox}>
          <Text style={{ color: "red", textAlign: "center" }}>
            No se pudo cargar tu información. Inicia sesión de nuevo.
          </Text>
        </View>
      </View>
    );
  }

  // Datos que llevará el QR (opción B que elegimos)
  const qrPayload = {
    prestador_id: user.id,
    origin: "OFICIOYA_QR",
  };

  // Lo convertimos a string para el valor del QR
  const qrValue = JSON.stringify(qrPayload).trim();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0A1F57" />
        </TouchableOpacity>
        <Text style={styles.title}>Mi Código QR</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Contenido */}
      <View style={styles.box}>
        <Text style={styles.infoText}>
          Este es tu código QR. Comparte este código con tus clientes para que puedan
          acceder a tu perfil y dejarte una reseña.
        </Text>

        <View style={styles.qrContainer}>
          <QRCode value={qrValue} size={220} />
        </View>

        <Text style={styles.usernameText}>@{user.username}</Text>

        <Text style={styles.helperText}>
          El QR contiene tu identificador interno como prestador. Solo funciona dentro
          de OficioYa.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
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
  centerBox: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  box: {
    marginTop: 40,
    backgroundColor: "white",
    marginHorizontal: 30,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 2,
  },
  infoText: {
    textAlign: "center",
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
  },
  qrContainer: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 15,
    elevation: 3,
  },
  usernameText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "700",
    color: "#0A1F57",
  },
  helperText: {
    marginTop: 10,
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
});
