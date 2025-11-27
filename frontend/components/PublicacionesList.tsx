import { View, Text, Image, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/constants/Config";
import { useAuth } from "@/context/AuthContext";

interface Publicacion {
    id: number;
    foto: string | null;
    descripcion: string;
    fecha: string;
    publico: boolean;
}

interface Props {
    usuarioId: number | string;
}

export default function PublicacionesList({ usuarioId }: Props) {
    const { token } = useAuth();
    const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (usuarioId) {
            fetchPublicaciones();
        }
    }, [usuarioId]);

    const fetchPublicaciones = async () => {
        try {
            setLoading(true);
            const headers: HeadersInit = {
                "Content-Type": "application/json",
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const res = await fetch(`${API_BASE_URL}/api/publicaciones/?usuario=${usuarioId}`, {
                headers: headers
            });

            if (res.ok) {
                const data = await res.json();
                // Si la respuesta es paginada (drf standard), data.results, si no data
                const results = Array.isArray(data) ? data : data.results || [];
                setPublicaciones(results);
            }
        } catch (error) {
            console.error("Error fetching publicaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item: pub }: { item: Publicacion }) => (
        <View style={styles.card}>
            {pub.foto && (
                <Image
                    source={{ uri: pub.foto.startsWith('http') ? pub.foto : `${API_BASE_URL}${pub.foto}` }}
                    style={styles.image}
                    resizeMode="cover"
                />
            )}
            <View style={styles.content}>
                <Text style={styles.description}>{pub.descripcion}</Text>
                <Text style={styles.date}>
                    {new Date(pub.fecha).toLocaleDateString()}
                    {!pub.publico && <Text style={styles.privateTag}> (Privada)</Text>}
                </Text>
            </View>
        </View>
    );

    if (loading) return <ActivityIndicator size="small" color="#0000ff" style={{ marginTop: 20 }} />;

    return (
        <FlatList
            data={publicaciones}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={<Text style={styles.title}>Publicaciones</Text>}
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No hay publicaciones para mostrar.</Text>
                </View>
            }
            contentContainerStyle={styles.listContent}
            style={styles.container}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        paddingHorizontal: 4,
    },
    listContent: {
        paddingBottom: 80, // Space for FAB
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
        color: "#333",
    },
    emptyContainer: {
        padding: 20,
        alignItems: "center",
    },
    emptyText: {
        color: "#666",
        fontStyle: "italic",
    },
    card: {
        backgroundColor: "white",
        borderRadius: 12,
        marginBottom: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#f0f0f0",
    },
    image: {
        width: "100%",
        height: 200,
        backgroundColor: "#e1e4e8",
    },
    content: {
        padding: 12,
    },
    description: {
        fontSize: 14,
        color: "#333",
        marginBottom: 8,
        lineHeight: 20,
    },
    date: {
        fontSize: 12,
        color: "#888",
    },
    privateTag: {
        color: "#d32f2f",
        fontWeight: "bold",
    },
});
