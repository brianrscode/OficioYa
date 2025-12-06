import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera"; //descargar paquete: npx expo install expo-camera
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function EscanerQRScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    requestPermission();
  }, []);

  const handleScan = (result: any) => {
    if (scanned) return;
    setScanned(true);

    try {
        const data = result?.data;

        const qrData = JSON.parse(data);

        if (qrData.origin !== "OFICIOYA_QR") {
          Alert.alert("Código inválido", "Este QR no pertenece a OficioYa.");
          setScanned(false);
          return;
        }

        if (!qrData.prestador_id) {
          Alert.alert("QR inválido");
          setScanned(false);
          return;
        }

        // Redirección
        router.push(`/prestador-buscado?id=${qrData.prestador_id}&fromQR=true`);

    } catch (e) {
      Alert.alert("Error", "El QR no contiene datos válidos.");
      setScanned(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.loader}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.loader}>
        <Text>No hay acceso a la cámara.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Permitir cámara</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0A1F57" />
        </TouchableOpacity>
        <Text style={styles.title}>Escanear QR</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Cámara */}
      <CameraView
        style={{ flex: 1 }}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={scanned ? undefined : handleScan}
      />

      {scanned && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.buttonText}>Escanear de nuevo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: 40,
    paddingBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },
  button: {
    padding: 14,
    backgroundColor: "#0A1F57",
    margin: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
