import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";

export default function LoginScreen() {
  const { login, user } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Cargar las fuentes de Google
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded) return null;

  const handleLogin = async () => {
    try {
      await login(username, password);
      Alert.alert("Bienvenido", "Inicio de sesión correcto");
      if (user?.rol === "prestador") {
        router.replace("/(tabs-prestador)");
      } else if (user?.rol === "contratante") {
        router.replace("/(tabs-contratante)");
      } else {
        router.replace("/auth/login");
      }
    } catch (error) {
      Alert.alert("Error", "Usuario o contraseña incorrectos");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/Logo_OficioYa.png")} // Asegúrate de que esta ruta sea correcta
        style={styles.logo}
      />

      <Text style={styles.title}>Iniciar Sesión</Text>

      <Text style={styles.label}>Username:</Text>
      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Contraseña:</Text>
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <Link href="/auth/recover" style={styles.linkSecondary}>
        Olvidé mi contraseña
      </Link>

      <Link href="/auth/register/step1-account" style={styles.linkPrimary}>
        Registrarme
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F6F7F8", paddingHorizontal: 30, },
  logo: {width: 120, height: 120, marginBottom: 20, resizeMode: "contain", },
  title: { fontSize: 28, fontFamily: "PlayfairDisplay_700Bold", marginBottom: 25, },
  label: {alignSelf: "flex-start", marginLeft: 5, marginBottom: 5, color: "#044081", fontWeight: "600", fontFamily: "PlayfairDisplay_400Regular", },
  input: {width: "100%", borderWidth: 1, borderColor: "#CFCFCF", borderRadius: 10, padding: 12, marginBottom: 15, backgroundColor: "#FFFFFF", },
  button: {width: "100%", backgroundColor: "#032B44", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10, },
  buttonText: {color: "#FFFFFF", fontWeight: "bold", fontSize: 16, },
  linkSecondary: {color: "#7A7A7A", marginTop: 15, fontFamily: "PlayfairDisplay_400Regular",},
  linkPrimary: {color: "#044081", marginTop: 8, fontWeight: "500", fontFamily: "PlayfairDisplay_400Regular", },
});
