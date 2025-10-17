import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRegistro } from "@/context/RegisterContext";
import { router } from "expo-router";

export default function Step3Role() {
  const { registro, setRegistro } = useRegistro();

  const toggleRol = () => {
    const nuevoRol = registro.rol === "prestador" ? "contratante" : "prestador";
    setRegistro({ ...registro, rol: nuevoRol });
  };

  const handleContinuar = () => {
    if (registro.rol === "prestador") {
      router.push("/auth/register/step4-services");
    } else {
      router.push("/auth/register/summary");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tipo de cuenta</Text>

      <TouchableOpacity style={styles.checkboxContainer} onPress={toggleRol}>
        <View style={[styles.checkbox, registro.rol === "prestador" && styles.checked]} />
        <Text style={styles.label}>Deseo ofrecer servicios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleContinuar}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 30, textAlign: "center" },
  checkboxContainer: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 6,
    marginRight: 10,
  },
  checked: { backgroundColor: "#007AFF" },
  label: { fontSize: 16 },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600" },
});
