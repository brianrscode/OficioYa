import { API_BASE_URL } from "@/constants/Config";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator, } from "react-native";
import { useRegistro } from "@/context/RegisterContext";
import { router } from "expo-router";
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_700Bold, } from "@expo-google-fonts/playfair-display";

export default function Summary() {
  const { registro } = useRegistro();
  const [nombresServicios, setNombresServicios] = useState<string[]>([]);
  const [loadingServicios, setLoadingServicios] = useState(true);
  const [aceptarTerminos, setAceptarTerminos] = useState(false);

  // Carga de fuentes
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
  });


  const API_URL = `${API_BASE_URL}/api/usuarios/register/`;
  const API_SERVICIOS = `${API_BASE_URL}/api/servicios/servicios/`;

  useEffect(() => {
    const cargarServicios = async () => {
      if (registro.rol !== "prestador" || !registro.servicios.length) {
        setLoadingServicios(false);
        return;
      }
      try {
        const res = await fetch(API_SERVICIOS);
        const data: Array<{ id: number; nombre: string }> = await res.json();
        const filtrados = data.filter((s) => registro.servicios.includes(s.id));
        setNombresServicios(filtrados.map((s) => s.nombre));
        console.log("contexto", registro);
      } catch (error) {
        console.error("Error al obtener servicios:", error);
      } finally {
        setLoadingServicios(false);
      }
    };
    cargarServicios();
  }, []);



  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#032B44" />
        <Text style={{ fontFamily: "PlayfairDisplay_400Regular", marginTop: 10 }}>
          Cargando fuentes...
        </Text>
      </View>
    );
  }

  const handleEnviar = async () => {
    console.log("Datos enviados:\n", registro);
    if (!aceptarTerminos) {
      Alert.alert("Atención", "Debes aceptar los términos y condiciones");
      return;
    }

    // Construir payload solo con campos aceptados por el backend
    const payload: any = {
      username: registro.username,
      email: registro.email,
      password: registro.password,
      nombres: registro.nombres,
      apellido_paterno: registro.apellido_paterno,
      apellido_materno: registro.apellido_materno || null,
      foto: null,
      sexo: registro.sexo || null,
      fecha_nacimiento: registro.fecha_nacimiento || null,
      ciudad: registro.ciudad || null,
      rol: registro.rol || 'contratante',
    };

    if (registro.rol === 'prestador') {
      payload.servicios = Array.isArray(registro.servicios) ? registro.servicios : [];
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let detail: any = null;
        try { detail = await res.json(); } catch { }
        console.error("Registro fallido", res.status, detail);
        const mensajes = detail && typeof detail === 'object'
          ? Object.entries(detail)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
            .join("\n")
          : "No se pudo registrar. Verifica tus datos.";
        Alert.alert("Error", mensajes);
        return;
      }

      Alert.alert("Éxito", "Tu cuenta ha sido creada correctamente");
      router.replace("/auth/login");
    } catch (error) {
      console.error("Error de red al registrar:", error);
      Alert.alert("Error", "No se pudo conectar al backend. Asegura que el servidor esté activo y la URL sea accesible desde tu dispositivo.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.brand}>OficioYa</Text>

      <Text style={styles.title}>Revisa tu información</Text>

      <Text style={styles.section}>Cuenta</Text>
      <Text style={styles.text}>Usuario: {registro.username}</Text>
      <Text style={styles.text}>Correo: {registro.email}</Text>

      <Text style={styles.section}>Datos personales</Text>
      <Text style={styles.text}>
        {registro.nombres} {registro.apellido_paterno} {registro.apellido_materno}
      </Text>
      <Text style={styles.text}>Sexo: {registro.sexo}</Text>
      <Text style={styles.text}>
        Fecha de nacimiento: {registro.fecha_nacimiento}
      </Text>
      <Text style={styles.text}>Ciudad: {registro.ciudad_nombre || "—"}</Text>

      <Text style={styles.section}>Rol</Text>
      <Text style={styles.text}>{registro.rol}</Text>

      {registro.rol === "prestador" && (
        <>
          <Text style={styles.section}>Servicios seleccionados</Text>
          {loadingServicios ? (
            <ActivityIndicator size="small" color="#032B44" />
          ) : (
            <Text style={styles.text}>
              {nombresServicios.join(", ") || "Sin servicios"}
            </Text>
          )}
        </>
      )}

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setAceptarTerminos(!aceptarTerminos)}
      >
        <View style={[styles.checkbox, aceptarTerminos && styles.checked]} />
        <Text style={styles.checkboxLabel}>Acepto términos y condiciones</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleEnviar}>
        <Text style={styles.buttonText}>Crear cuenta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F6F7F8", paddingHorizontal: 30, paddingVertical: 40, },
  brand: { position: "absolute", top: 70, left: 35, fontFamily: "PlayfairDisplay_700Bold", fontSize: 20, color: "#032B44", },
  title: { fontSize: 26, fontFamily: "PlayfairDisplay_700Bold", marginBottom: 25, textAlign: "center", },
  section: { alignSelf: "flex-start", fontFamily: "PlayfairDisplay_700Bold", color: "#044081", fontSize: 18, marginTop: 20, },
  text: { alignSelf: "flex-start", fontFamily: "PlayfairDisplay_400Regular", fontSize: 16, marginTop: 5, },
  checkboxContainer: { flexDirection: "row", alignItems: "center", marginTop: 25, marginBottom: 15, alignSelf: "flex-start", },
  checkbox: { width: 24, height: 24, borderWidth: 2, borderColor: "#032B44", borderRadius: 6, marginRight: 10, },
  checked: { backgroundColor: "#032B44", },
  checkboxLabel: { fontFamily: "PlayfairDisplay_400Regular", fontSize: 16, color: "#032B44", },
  button: { width: "100%", backgroundColor: "#032B44", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10, },
  buttonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16, },
});
