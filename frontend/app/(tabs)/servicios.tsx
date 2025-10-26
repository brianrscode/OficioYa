import { View, Text, StyleSheet } from "react-native";

export default function ServiciosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Servicios disponibles</Text>
      <Text>Aquí podrás buscar, filtrar o publicar servicios.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
});
