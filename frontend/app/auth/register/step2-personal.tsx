import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRegistro } from "@/context/RegisterContext";
import { router } from "expo-router";

export default function Step2Personal() {
  const { registro, setRegistro } = useRegistro();

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

      <TextInput
        placeholder="Ciudad"
        style={styles.input}
        value={registro.ciudad}
        onChangeText={(text) => setRegistro({ ...registro, ciudad: text })}
      />

      <TouchableOpacity style={styles.button} onPress={() => router.push("/auth/register/step3-role")}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
