import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRegistro } from "@/context/RegisterContext";
import { router } from "expo-router";

export default function Step1Account() {
  const { registro, setRegistro } = useRegistro();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crea tu cuenta</Text>

      <TextInput
        placeholder="Nombre de usuario"
        style={styles.input}
        value={registro.username}
        onChangeText={(text) => setRegistro({ ...registro, username: text })}
      />

      <TextInput
        placeholder="Correo electrónico"
        style={styles.input}
        keyboardType="email-address"
        value={registro.email}
        onChangeText={(text) => setRegistro({ ...registro, email: text })}
      />

      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        secureTextEntry
        value={registro.password}
        onChangeText={(text) => setRegistro({ ...registro, password: text })}
      />

      <TouchableOpacity style={styles.button} onPress={() => router.push("/auth/register/step2-personal")}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 30, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
