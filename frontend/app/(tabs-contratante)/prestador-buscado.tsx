import { View, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/constants/Config";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import PublicacionesList from "@/components/PublicacionesList";

export default function PrestadorBuscadoScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [prestador, setPrestador] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (id) {
            fetchPrestador();
        }
    }, [id]);

    const fetchPrestador = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/servicios/prestadores/${id}/`);
            if (!res.ok) throw new Error("No se pudo cargar la información del prestador");
            const data = await res.json();
            setPrestador(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator size="large" style={styles.loader} />;
    if (error) return <View style={styles.container}><Text style={styles.error}>{error}</Text></View>;
    if (!prestador) return <View style={styles.container}><Text>No se encontró el prestador.</Text></View>;

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity onPress={() => router.push("/buscar")} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} />
                <Text style={styles.backText}>Volver</Text>
            </TouchableOpacity>

            <View style={styles.header}>
                <Image
                    source={{ uri: prestador.foto || "https://imgs.search.brave.com/QSSPOEXA485g-XIleyFoKfUyP_QT2ekHnspkL7f-6rE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNy8x/Mi8xNi8wNi80MS9h/dmF0YXItMzAyMjIx/NV82NDAuanBn" }}
                    style={styles.avatar}
                />
                <Text style={styles.name}>
                    {prestador.nombres} {prestador.apellido_paterno} {prestador.apellido_materno}
                </Text>
                <Text style={styles.username}>@{prestador.prestador}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ubicación</Text>
                <Text style={styles.text}>{prestador.ciudad || "No especificada"}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Servicios</Text>
                <View style={styles.tags}>
                    {prestador.servicios.map((s: string, idx: number) => (
                        <View key={idx} style={styles.tag}>
                            <Text style={styles.tagText}>{s}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contacto</Text>
                <Text style={styles.text}>Email: {prestador.email}</Text>
                <Text style={styles.text}>Teléfono: {prestador.telefono}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Miembro desde</Text>
                <Text style={styles.text}>{new Date(prestador.fecha_registro).toLocaleDateString()}</Text>
            </View>

            <PublicacionesList usuarioId={id as string} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#F3F4F6" },
    loader: { marginTop: 50 },
    error: { color: "red", textAlign: "center", marginTop: 20 },
    backButton: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
    backText: { color: "#0A1F57", fontSize: 14, marginLeft: 4 },
    header: { alignItems: "center", marginBottom: 24, marginTop: 4 },
    avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#0A1F57", justifyContent: "center", alignItems: "center", marginBottom: 14 },
    avatarText: { color: "white", fontSize: 36, fontWeight: "bold" },
    name: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
    username: { fontSize: 16, color: "#666", marginTop: 4 },
    section: { backgroundColor: "#fff", padding: 16, borderRadius: 16, marginBottom: 16, shadowOpacity: 0.08, shadowRadius: 7, elevation: 1 },
    sectionTitle: { fontSize: 17, fontWeight: "600", marginBottom: 10 },
    text: { fontSize: 16, color: "#444" },
    tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    tag: { backgroundColor: "#f0f0f0", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
    tagText: { color: "#333" },
    avatar: { width: 90, height: 90, borderRadius: 50, marginBottom: 16 },
});
