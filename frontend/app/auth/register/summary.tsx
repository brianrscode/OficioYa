import { Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import { useRegistro } from "@/context/RegisterContext";
import { router } from "expo-router";

export default function Summary() {
  const { registro } = useRegistro();

  // Cambia esta URL base según tu backend
  const API_URL = "http://127.0.0.1:8000/api/usuarios/register/";

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
      <Text>Ciudad: {registro.ciudad}</Text>

      <Text style={styles.section}>Rol</Text>
      <Text>{registro.rol}</Text>

      {registro.rol === "prestador" && (
        <>
          <Text style={styles.section}>Servicios seleccionados</Text>
          <Text>{registro.servicios.join(", ")}</Text>
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
