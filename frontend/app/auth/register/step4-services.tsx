import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useRegistro } from "@/context/RegisterContext";
import { router } from "expo-router";

export default function Step4Services() {
  const { registro, setRegistro } = useRegistro();
  const [servicios, setServicios] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);

  useEffect(() => {
    fetch("https://tu-backend/api/servicios/")
      .then((res) => res.json())
      .then((data) => setServicios(data))
      .catch((err) => console.error("Error al obtener servicios:", err));
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

  return (
    <View style={styles.container}>
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
            <Text style={styles.itemText}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={handleContinuar}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  item: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
  },
  itemSeleccionado: {
    backgroundColor: "#007AFF22",
    borderColor: "#007AFF",
  },
  itemText: { fontSize: 16 },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
