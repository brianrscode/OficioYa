import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRegistro } from "@/context/RegisterContext";
import { router } from "expo-router";
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_700Bold, } from "@expo-google-fonts/playfair-display";

export default function Step3Role() {

  const { registro, setRegistro } = useRegistro();
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded) return null;

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
      <Text style={styles.brand}>OficioYa</Text>

      <Text style={styles.title}>Tipo de cuenta</Text>

      <TouchableOpacity style={styles.checkboxContainer} onPress={toggleRol}>
        <View
          style={[
            styles.checkbox,
            registro.rol === "prestador" && styles.checked,
          ]}
        />
        <Text style={styles.label}>Deseo ofrecer servicios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleContinuar}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F6F7F8", paddingHorizontal: 30, },
  brand: { position: "absolute", top: 70, left: 35, fontFamily: "PlayfairDisplay_700Bold", fontSize: 20, color: "#032B44", },
  title: { fontSize: 26, fontFamily: "PlayfairDisplay_700Bold", marginBottom: 25, },
  checkboxContainer: { flexDirection: "row", alignItems: "center", marginBottom: 30, },
  checkbox: { width: 24, height: 24, borderWidth: 2, borderColor: "#032B44", borderRadius: 6, marginRight: 10, },
  checked: { backgroundColor: "#032B44", },
  label: { fontSize: 16, color: "#032B44", fontFamily: "PlayfairDisplay_400Regular", },
  button: { width: "100%", backgroundColor: "#032B44", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10, },
  buttonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16, },
});
