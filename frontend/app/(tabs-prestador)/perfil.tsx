import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Link, router, useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function PerfilScreen() {
  const { user, logout, reloadUser } = useAuth();

  useFocusEffect(
    useCallback(() => {
      reloadUser();
    }, [])
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <Text style={styles.title}>Mi Perfil</Text>
      </View>
      <View style={styles.profileBox}>
        <Image
          source={{ uri: user?.foto || "https://imgs.search.brave.com/QSSPOEXA485g-XIleyFoKfUyP_QT2ekHnspkL7f-6rE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNy8x/Mi8xNi8wNi80MS9h/dmF0YXItMzAyMjIx/NV82NDAuanBn" }}
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

        <View style={styles.divider} />

        {/* Mis publicaciones */}
        <Link href={"/perfil-prestador/mis-publicaciones"}>
          <View style={styles.iconBlueBox}>
            <Ionicons name="image" size={20} color="#1D4ED8" />
          </View>
          <Text style={styles.rowText}>Mis publicaciones</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </Link>
      </View>

      {/* Cerrar sesión */}
      <View style={styles.logoutCard}>
        <TouchableOpacity style={styles.logoutRow} onPress={logout}>
          <View style={styles.iconRedBox}>
            <Ionicons name="exit-outline" size={20} color="#D10A0A" />
          </View>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
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
    backgroundColor: "#FFFFFF", borderRadius: 25, padding: 18, marginBottom: 20, shadowOpacity: 0.05,
    shadowRadius: 5, elevation: 2,
  },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 10, },
  rowText: { flex: 1, fontSize: 16, },
  iconBlueBox: { backgroundColor: "#DBEAFE", padding: 10, borderRadius: 50, marginRight: 10, },
  iconRedBox: { backgroundColor: "#FEE2E2", padding: 10, borderRadius: 50, marginRight: 10, },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 6, },
  button: { marginTop: 20, backgroundColor: "#FF3B30", padding: 12, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  dataLabel: { fontSize: 14, color: "#6B7280", fontWeight: "500", marginTop: 8, textAlign: "center" },
  dataValue: { fontSize: 16, fontWeight: "600", marginTop: 2, textAlign: "center" },
  noUserText: { fontSize: 16, color: "#DC2626", fontWeight: "600", textAlign: "center", paddingVertical: 10, },
  logoutCard: { backgroundColor: "#FFFFFF", borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14, marginBottom: 20, },
  logoutText: { fontSize: 16, color: "#D10A0A", fontWeight: "600", },
  logoutRow: { flexDirection: "row", alignItems: "center", paddingVertical: 16, },
});