import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRegistro } from "@/context/RegisterContext";
import { router } from "expo-router";

export default function Step2Personal() {
  const { registro, setRegistro } = useRegistro();
  const [ciudades, setCiudades] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_CIUDADES = "http://127.0.0.1:8000/api/ubicacion/ciudades/";

  useEffect(() => {
    const obtenerCiudades = async () => {
      try {
        const res = await fetch(API_CIUDADES);
        const data = await res.json();
        setCiudades(data);
      } catch (error) {
        console.error("Error al cargar ciudades:", error);
      } finally {
        setLoading(false);
      }
    };
    obtenerCiudades();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Cargando ciudades...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Datos personales</Text>

      <TextInput
        placeholder="Nombres"
        style={styles.input}
        value={registro.nombres}
        onChangeText={(text) => setRegistro({ ...registro, nombres: text })}
      />

      <TextInput
        placeholder="Apellido paterno"
        style={styles.input}
        value={registro.apellido_paterno}
        onChangeText={(text) => setRegistro({ ...registro, apellido_paterno: text })}
      />

      <TextInput
        placeholder="Apellido materno"
        style={styles.input}
        value={registro.apellido_materno}
        onChangeText={(text) => setRegistro({ ...registro, apellido_materno: text })}
      />

      <TextInput
        placeholder="Sexo (M/F)"
        style={styles.input}
        value={registro.sexo}
        onChangeText={(text) => setRegistro({ ...registro, sexo: text })}
      />

      <TextInput
        placeholder="Fecha de nacimiento (YYYY-MM-DD)"
        style={styles.input}
        value={registro.fecha_nacimiento}
        onChangeText={(text) => setRegistro({ ...registro, fecha_nacimiento: text })}
      />

      <Text style={styles.label}>Ciudad</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={registro.ciudad}
          onValueChange={(valor) => setRegistro({ ...registro, ciudad: valor })}
        >
          <Picker.Item label="Selecciona una ciudad..." value="" />
          {ciudades.map((c) => (
            <Picker.Item key={c.id} label={c.nombre} value={c.id} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/auth/register/step3-role")}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  label: { marginBottom: 5, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
  },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
