import { View, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/constants/Config";
import { Ionicons } from "@expo/vector-icons";

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
                <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>
                        {prestador.nombres[0]}{prestador.apellido_paterno[0]}
                    </Text>
                </View>
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    loader: { marginTop: 50 },
    error: { color: "red", textAlign: "center", marginTop: 20 },
    backButton: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
    backText: {fontSize: 16, marginLeft: 4 },
    header: { alignItems: "center", marginBottom: 24 },
    avatarPlaceholder: {
        width: 80, height: 80, borderRadius: 40, backgroundColor: "#044081",
        justifyContent: "center", alignItems: "center", marginBottom: 12
    },
    avatarText: { color: "white", fontSize: 32, fontWeight: "bold" },
    name: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
    username: { fontSize: 16, color: "#666", marginTop: 4 },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8, color: "#333" },
    text: { fontSize: 16, color: "#444" },
    tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    tag: { backgroundColor: "#f0f0f0", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
    tagText: { color: "#333" },
});
