import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRegistro } from "@/context/RegisterContext";
import { router } from "expo-router";
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";

export default function Step1Account() {

  const { registro, setRegistro } = useRegistro();

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded) return null;

  const validarCampos = () => {
    if (
      !registro.username.trim() ||
      !registro.email.trim() ||
      !registro.telefono.trim() ||
      !registro.password.trim()
    ) {
      Alert.alert("Campos incompletos", "Por favor completa todos los campos antes de continuar.");
      return false;
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>OficioYa</Text>

      <Text style={styles.title}>Crea tu cuenta</Text>

      <TextInput
        placeholder="Username"
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
        placeholder="Teléfono"
        style={styles.input}
        keyboardType="phone-pad"
        value={registro.telefono}
        onChangeText={(text) => setRegistro({ ...registro, telefono: text })}
      />

      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        secureTextEntry
        value={registro.password}
        onChangeText={(text) => setRegistro({ ...registro, password: text })}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (validarCampos()) {
            router.push("/auth/register/step2-personal");
          }
        }}
      >
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F6F7F8", paddingHorizontal: 30 },
  brand: { position: "absolute", top: 70, left: 35, fontFamily: "PlayfairDisplay_700Bold", fontSize: 20, color: "#032B44" },
  title: { fontSize: 26, fontFamily: "PlayfairDisplay_700Bold", marginBottom: 25 },
  input: { width: "100%", borderWidth: 1, borderColor: "#CFCFCF", borderRadius: 10, padding: 12, marginBottom: 15, backgroundColor: "#FFFFFF", fontFamily: "PlayfairDisplay_400Regular" },
  button: { width: "100%", backgroundColor: "#032B44", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
});
