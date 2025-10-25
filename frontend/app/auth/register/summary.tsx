import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useRegistro } from "@/context/RegisterContext";
import { router } from "expo-router";

export default function Summary() {
  const { registro } = useRegistro();
  const [nombresServicios, setNombresServicios] = useState([]);
  const [loadingServicios, setLoadingServicios] = useState(true);

  const API_URL = "http://127.0.0.1:8000/api/usuarios/register/";
  const API_SERVICIOS = "http://127.0.0.1:8000/api/servicios/servicios/";

  // Cargar los nombres de los servicios seleccionados
  useEffect(() => {
    const cargarServicios = async () => {
      if (registro.rol !== "prestador" || !registro.servicios.length) {
        setLoadingServicios(false);
        return;
      }
      try {
        const res = await fetch(API_SERVICIOS);
        const data = await res.json();
        const filtrados = data.filter((s) => registro.servicios.includes(s.id));
        setNombresServicios(filtrados.map((s) => s.nombre));
      } catch (error) {
        console.error("Error al obtener servicios:", error);
      } finally {
        setLoadingServicios(false);
      }
    };

    cargarServicios();
  }, []);

  const handleEnviar = async () => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registro),
      });

      if (!res.ok) throw new Error("Error al registrar usuario");
      Alert.alert("Éxito", "Tu cuenta ha sido creada correctamente");
      router.replace("/auth/login");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo completar el registro");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Revisa tu información</Text>

      <Text style={styles.section}>Cuenta</Text>
      <Text>Usuario: {registro.username}</Text>
      <Text>Email: {registro.email}</Text>

      <Text style={styles.section}>Datos personales</Text>
      <Text>{registro.nombres} {registro.apellido_paterno} {registro.apellido_materno}</Text>
      <Text>Sexo: {registro.sexo}</Text>
      <Text>Fecha de nacimiento: {registro.fecha_nacimiento}</Text>
      <Text>Ciudad (ID): {registro.ciudad}</Text>

      <Text style={styles.section}>Rol</Text>
      <Text>{registro.rol}</Text>

      {registro.rol === "prestador" && (
        <>
          <Text style={styles.section}>Servicios seleccionados</Text>
          {loadingServicios ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <Text>{nombresServicios.join(", ") || "Sin servicios"}</Text>
          )}
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleEnviar}>
        <Text style={styles.buttonText}>Crear cuenta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  section: { marginTop: 15, fontSize: 18, fontWeight: "bold", color: "#007AFF" },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
