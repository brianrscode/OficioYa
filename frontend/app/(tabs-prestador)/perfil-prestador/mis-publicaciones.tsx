import { API_BASE_URL } from "@/constants/Config";
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import PublicacionesList from "@/components/PublicacionesList";
import { router } from "expo-router";

const navigateCrearPublicacion = () => {
    router.push("/(tabs-prestador)/perfil-prestador/crear-publicacion");
}

export default function MisPublicacionesScreen() {
    const { user, token } = useAuth();
    const [publicaciones, setPublicaciones] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPublicaciones = async () => {
        try {
            const url = `${API_BASE_URL}/api/publicaciones/?usuario=${user.id}`;

            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                console.log("Error HTTP:", response.status, await response.text());
                return;
            }

            const data = await response.json();
            console.log("Datos recibidos:", data);

        } catch (error) {
            console.log("Error en fetchPublicaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPublicaciones();
    }, [user, token]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#005CFB" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Mis Publicaciones</Text>

            <PublicacionesList usuarioId={user.id} />

            <TouchableOpacity style={styles.fab} onPress={navigateCrearPublicacion}>
                <Ionicons name="add" size={22} color="#fff" />
                <Text style={styles.fabText}>Nueva</Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5F6FA", paddingHorizontal: 16, paddingTop: 50 },
    header: { fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 20 },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    card: {
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        borderRadius: 16,
        marginBottom: 18,
        shadowColor: "#000",
        shadowOpacity: 0.07,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 3,
    },
    cardInfo: { flex: 1, paddingRight: 10 },
    cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 2 },
    cardCategory: { color: "#7A7A7A", marginBottom: 12 },
    cardActions: { flexDirection: "row", gap: 10 },
    editButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EAEAEA",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    editText: { marginLeft: 4, fontSize: 14, fontWeight: "600" },
    deleteButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FF7D7D",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    deleteText: { marginLeft: 4, fontSize: 14, fontWeight: "600", color: "#fff" },
    imageBox: { width: 80, height: 80, borderRadius: 12, backgroundColor: "#DCEEFF" },
    placeholder: { backgroundColor: "#DCEEFF" },
    fab: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#005CFB",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 50,
        elevation: 4,
    },
    fabText: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 6 },
});
