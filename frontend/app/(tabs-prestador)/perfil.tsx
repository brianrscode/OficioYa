import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";

export default function PerfilScreen() {
  const { user, logout } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Mi Perfil</Text>
      </View>
      <View style={styles.profileBox}>
        <Image
          source={{ uri: "" }}
          style={styles.avatar}
        />
        {user ? (
          <>
            <Text style={styles.dataLabel}>Usuario:</Text>
            <Text style={styles.dataValue}>{user.username}</Text>

            <Text style={styles.dataLabel}>Correo:</Text>
            <Text style={styles.dataValue}>{user.email}</Text>

            <Text style={styles.dataLabel}>Rol:</Text>
            <Text style={styles.dataValue}>{user.rol}</Text>
          </>
        ) : (
          <Text style={styles.noUserText}>No hay usuario activo</Text>
        )}
      </View>

      {/* Sección: Opciones */}
      <View style={styles.card}>

        {/* Modificar mis datos */}
        <Link href="/perfil-prestador/modificar-datos" style={styles.row}>
          <View style={styles.iconBlueBox}>
            <Ionicons name="pencil" size={20} color="#1D4ED8" />
          </View>
          <Text style={styles.rowText}>Modificar mis datos</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </Link>

        <View style={styles.divider} />

        {/* Cambiar contraseña */}
        <Link href={"/perfil-prestador/cambiar-contrasena"}>
          <View style={styles.iconBlueBox}>
            <Ionicons name="lock-closed" size={20} color="#1D4ED8" />
          </View>
          <Text style={styles.rowText}>Cambiar contraseña</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </Link>
      </View>

      {/* Cerrar sesión */}
      <View style={styles.card}>
        <TouchableOpacity style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6", paddingHorizontal: 20, },
  header: { flexDirection: "row", alignItems: "center", paddingVertical: 20, },
  title: { flex: 1, textAlign: "center", fontSize: 22, fontWeight: "700", marginRight: 24, },
  profileBox: { alignItems: "center", marginTop: 5, marginBottom: 20, },
  avatar: { width: 130, height: 130, borderRadius: 100, },
  profileName: { fontSize: 24, fontWeight: "700", marginTop: 12, },
  profileRole: { color: "#6B7280", fontSize: 16, },
  card: {
    backgroundColor: "#FFFFFF", borderRadius: 25, padding: 18, marginBottom: 20, shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 10, },
  rowText: { flex: 1, fontSize: 16, },
  iconBlueBox: { backgroundColor: "#DBEAFE", padding: 10, borderRadius: 50, marginRight: 10, },
  iconRedBox: { backgroundColor: "#FEE2E2", padding: 10, borderRadius: 50, marginRight: 10, },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 6, },
  button: { marginTop: 20, backgroundColor: "#FF3B30", padding: 12, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  dataLabel: { fontSize: 14, color: "#6B7280", fontWeight: "500", marginTop: 8, textAlign: "center" },
  dataValue: { fontSize: 16, color: "#111827", fontWeight: "600", marginTop: 2, textAlign: "center" },
  noUserText: { fontSize: 16, color: "#DC2626", fontWeight: "600", textAlign: "center", paddingVertical: 10, },
});