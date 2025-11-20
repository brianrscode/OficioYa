import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRegistro } from "@/context/RegisterContext";
import { router } from "expo-router";
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_700Bold, } from "@expo-google-fonts/playfair-display";

export default function Step2Personal() {
  const { registro, setRegistro } = useRegistro();

  const [ciudades, setCiudades] = useState<Array<{ id: number; nombre: string }>>([]);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
  });

  useEffect(() => {
    const obtenerCiudades = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/ubicacion/ciudades/");
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

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#032B44" />
        <Text style={{ fontFamily: "PlayfairDisplay_400Regular", marginTop: 10 }}>
          Cargando...
        </Text>
      </View>
    );
  }

  const handleCiudadChange = (valor: number | string, index: number) => {
    let nombre = "";
    let id: number | "" = "";
    if (index > 0) {
      id = typeof valor === "string" ? parseInt(valor, 10) : valor;
      const found = ciudades.find((c) => c.id === id);
      nombre = found?.nombre ?? "";
    }
    setRegistro({ ...registro, ciudad: id, ciudad_nombre: nombre });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>OficioYa</Text>

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
          onValueChange={handleCiudadChange}
          dropdownIconColor="#032B44"
        >
          <Picker.Item label="Selecciona una ciudad..." value="" />
          {ciudades.map((c) => (
            <Picker.Item key={c.id} label={c.nombre} value={c.id} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/auth/register/step3-role")}
      >
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F6F7F8", paddingHorizontal: 30, },
  brand: { position: "absolute", top: 70, left: 35, fontFamily: "PlayfairDisplay_700Bold", fontSize: 20, color: "#032B44", },
  title: { fontSize: 26, fontFamily: "PlayfairDisplay_700Bold", marginBottom: 25, },
  label: { alignSelf: "flex-start", marginBottom: 5, color: "#044081", fontWeight: "600", fontFamily: "PlayfairDisplay_400Regular", },
  input: { width: "100%", borderWidth: 1, borderColor: "#CFCFCF", borderRadius: 10, padding: 12, marginBottom: 15, backgroundColor: "#FFFFFF", fontFamily: "PlayfairDisplay_400Regular", },
  pickerContainer: { width: "100%", borderWidth: 1, borderColor: "#CFCFCF", borderRadius: 10, marginBottom: 20, backgroundColor: "#FFFFFF", },
  button: { width: "100%", backgroundColor: "#032B44", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10, },
  buttonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16, },
});
