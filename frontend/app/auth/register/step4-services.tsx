import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useRegistro } from "@/context/RegisterContext";
import { router } from "expo-router";
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_700Bold, } from "@expo-google-fonts/playfair-display";

export default function Step4Services() {
  const [servicios, setServicios] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const { registro, setRegistro } = useRegistro();
  // const [servicios, setServicios] = useState<
  //   Array<{ id: number; nombre: string }>
  // >([]);
  // const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://127.0.0.1:8000/api/servicios/servicios/";

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
  });

  useEffect(() => {
    const obtenerServicios = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setServicios(data);
      } catch (error) {
        console.error("Error al obtener servicios:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerServicios();
  }, []);

  const toggleSeleccion = (id: number) => {
    if (seleccionados.includes(id)) {
      setSeleccionados(seleccionados.filter((s) => s !== id));
    } else {
      setSeleccionados([...seleccionados, id]);
    }
  };

  const handleContinuar = () => {
    setRegistro({ ...registro, servicios: seleccionados });
    router.push("/auth/register/summary");
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#032B44" />
        <Text style={{ fontFamily: "PlayfairDisplay_400Regular", marginTop: 10 }}>
          Cargando servicios...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>OficioYa</Text>
      <Text style={styles.title}>Selecciona los servicios que ofreces</Text>

      <FlatList
        data={servicios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.item,
              seleccionados.includes(item.id) && styles.itemSeleccionado,
            ]}
            onPress={() => toggleSeleccion(item.id)}
          >
            <Text
              style={[
                styles.itemText,
                seleccionados.includes(item.id) && styles.itemTextSeleccionado,
              ]}
            >
              {item.nombre}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={[styles.button, seleccionados.length === 0 && { opacity: 0.6 }]}
        disabled={seleccionados.length === 0}
        onPress={handleContinuar}
      >
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F6F7F8", },
  container: { flex: 1, backgroundColor: "#F6F7F8", paddingHorizontal: 30, paddingTop: 100, },
  brand: { position: "absolute", top: 70, left: 35, fontFamily: "PlayfairDisplay_700Bold", fontSize: 20, color: "#032B44", },
  title: { fontSize: 24, fontFamily: "PlayfairDisplay_700Bold", textAlign: "center", marginBottom: 20, },
  item: { padding: 15, borderWidth: 1, borderColor: "#CFCFCF", borderRadius: 10, marginBottom: 10, backgroundColor: "#FFFFFF", },
  itemSeleccionado: { backgroundColor: "#032B44", borderColor: "#032B44", },
  itemText: { fontSize: 16, fontFamily: "PlayfairDisplay_400Regular", },
  itemTextSeleccionado: { color: "#FFFFFF", },
  button: { backgroundColor: "#032B44", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 20, },
  buttonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16, },
});
