import PublicacionesList from "@/components/PublicacionesList";
import { View, Text, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <PublicacionesList />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F3F4F6" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
});
