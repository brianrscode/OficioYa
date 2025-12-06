import { View, Text, TextInput, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal} from "react-native"; 
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/constants/Config";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import PublicacionesList from "@/components/PublicacionesList";
import { useAuth } from "@/context/AuthContext";


export default function PrestadorBuscadoScreen() {
    const { user, accessToken } = useAuth();
    const { id, fromQR} = useLocalSearchParams();
    const llegoPorQR = fromQR === "true";
    const router = useRouter();

    const [prestador, setPrestador] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [reviews, setReviews] = useState<any[]>([]);
    const [myReview, setMyReview] = useState<any>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [calificacion, setCalificacion] = useState(0);
    const [opinion, setOpinion] = useState("");

    useEffect(() => {
        if (id) {
            fetchPrestador();
            loadReviews();
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

    const loadReviews = async () => {
        try {
            const res = await fetch(
                `${API_BASE_URL}/api/reviews/?calificado=${id}`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` }
                }
            );

            const data = await res.json();
            setReviews(Array.isArray(data) ? data : []);

            const mine = data.find((r: any) => r.calificador === user.id);
            setMyReview(mine || null);
            //console.log("REVIEW DATA:", data);

        } catch (error) {
            console.log("Error al cargar reseñas", error);
        }

    };

    const publicarReview = async () => {

        if (calificacion === 0) {
            Alert.alert("Debes seleccionar una calificación");
            return;
        }

        const payload = {
            calificacion,
            descripcion: opinion || "",
            calificado: parseInt(id as string)
        };

        const url = myReview
            ? `${API_BASE_URL}/api/reviews/${myReview.id}/`
            : `${API_BASE_URL}/api/reviews/`;

        const method = myReview ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                console.log(await res.text());
                Alert.alert("Error al guardar la reseña");
                return;
            }

            Alert.alert(myReview ? "Reseña actualizada" : "Reseña publicada");

            setModalVisible(false);
            setOpinion("");
            setCalificacion(0);

            loadReviews();

        } catch (error) {
            console.log("Error al publicar reseña", error);
        }
    };

    const eliminarReseña = async () => {
        try {
            const res = await fetch(
                `${API_BASE_URL}/api/reviews/${myReview.id}/`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${accessToken}` }
                }
            );

            if (!res.ok) {
                console.log(await res.text());
                return Alert.alert("Error al eliminar la reseña");
            }

            Alert.alert("Reseña eliminada");
            setMyReview(null);
            loadReviews();

        } catch (error) {
            console.log("Error al eliminar reseña", error);
        }
    };

    const promedio =
        reviews.length > 0
            ? (reviews.reduce((acc, r) => acc + r.calificacion, 0) / reviews.length).toFixed(1)
            : null;

    const StarSelector = () => (
        <View style={{ flexDirection: "row", marginBottom: 10 }}>
            {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity key={s} onPress={() => setCalificacion(s)}>
                    <Ionicons
                        name={s <= calificacion ? "star" : "star-outline"}
                        size={32}
                        color="#00273D"
                    />
                </TouchableOpacity>
            ))}
        </View>
    );

    const StarDisplay = ({ value }: any) => (
        <View style={{ flexDirection: "row" }}>
            {[1, 2, 3, 4, 5].map((s) => (
                <Ionicons
                    key={s}
                    name={s <= value ? "star" : "star-outline"}
                    size={20}
                    color="#00273D"
                />
            ))}
        </View>
    );

    if (loading) return <ActivityIndicator size="large" style={styles.loader} />;
    if (error) return <View style={styles.container}><Text style={styles.error}>{error}</Text></View>;
    if (!prestador) return <View style={styles.container}><Text>No se encontró el prestador.</Text></View>;

    return (
        <ScrollView style={styles.container}>

            {/* BOTÓN VOLVER */}
            <TouchableOpacity onPress={() => router.push("/buscar")} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} />
                <Text style={styles.backText}>Volver</Text>
            </TouchableOpacity>

            {/* HEADER */}
            <View style={styles.header}>
                <Image
                    source={{ uri: prestador.foto || "https://imgs.search.brave.com/QSSPOEXA485g-XIleyFoKfUyP_QT2ekHnspkL7f-6rE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNy8x/Mi8xNi8wNi80MS9h/dmF0YXItMzAyMjIx/NV82NDAuanBn" }}
                    style={styles.avatar}
                />
                <Text style={styles.name}>
                    {prestador.nombres} {prestador.apellido_paterno} {prestador.apellido_materno}
                </Text>
                <Text style={styles.username}>@{prestador.prestador}</Text>

                {promedio && <StarDisplay value={Math.round(Number(promedio))} />}
            </View>

            {/* UBICACIÓN */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ubicación</Text>
                <Text style={styles.text}>{prestador.ciudad || "No especificada"}</Text>
            </View>

            {/* SERVICIOS */}
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

            {/* CONTACTO */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contacto</Text>
                <Text style={styles.text}>Email: {prestador.email}</Text>
                <Text style={styles.text}>Teléfono: {prestador.telefono}</Text>
            </View>

            {/* FECHA */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Miembro desde</Text>
                <Text style={styles.text}>{new Date(prestador.fecha_registro).toLocaleDateString()}</Text>
            </View>

            {/* PUBLICACIONES */}
            <PublicacionesList usuarioId={id as string} />

            {/* Reseñas */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Reseñas</Text>
                {!llegoPorQR &&(
                    <Text style={{color: "#D00", fontWeight: "600", marginBottom: 10}}>
                        Debes escanear el QR del prestador para reseñar
                    </Text>
                )}
                <Text style={{ color: "#666" }}>{reviews.length} reseñas</Text>

                {/* BOTÓN PUBLICAR */}
                {user.id !== prestador.id && llegoPorQR &&(
                    <TouchableOpacity
                        style={styles.postButton}
                        onPress={() => {
                            setOpinion(myReview?.descripcion || "");
                            setCalificacion(myReview?.calificacion || 0);
                            setModalVisible(true);
                        }}
                    >
                        <Ionicons name="create-outline" size={20} color="#fff" />
                        <Text style={styles.postButtonText}>
                            {myReview ? "Editar reseña" : "Publicar reseña"}
                        </Text>
                    </TouchableOpacity>
                )}
                {/* LISTA */}
                {reviews.length === 0 ? (
                    <Text style={{ color: "#777" }}>Aún no hay reseñas</Text>
                ) : (
                    reviews.map((r) => (
                        <View key={r.id} style={styles.reviewCard}>

                            {/* FOTO + USERNAME */}
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                                <Image
                                    source={{
                                        uri: r.calificador_data?.foto
                                            || "https://imgs.search.brave.com/QSSPOEXA485g-XIleyFoKfUyP_QT2ekHnspkL7f-6rE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNy8x/Mi8xNi8wNi80MS9h/dmF0YXItMzAyMjIx/NV82NDAuanBn"
                                    }}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 20,
                                        marginRight: 10
                                    }}
                                />
                                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                                    {r.calificador_data?.username || "Usuario"}
                                </Text>
                            </View>

                            <StarDisplay value={r.calificacion} />

                            <Text style={{ marginTop: 6 }}>{r.descripcion}</Text>

                            <Text style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                                {new Date(r.fecha).toLocaleDateString()}
                            </Text>
                        </View>
                    ))
                )}

            </View>

            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 10 }}>
                            Comparte tu experiencia
                        </Text>

                        <StarSelector />

                        <TextInput
                            style={styles.input}
                            placeholder="Escribe un comentario..."
                            multiline
                            value={opinion}
                            onChangeText={setOpinion}
                        />

                        <TouchableOpacity style={styles.saveButton} onPress={publicarReview}>
                            <Text style={styles.saveButtonText}>Publicar</Text>
                        </TouchableOpacity>

                        {myReview && (
                            <TouchableOpacity onPress={eliminarReseña}>
                                <Text style={{ color: "red", marginTop: 12 }}>Eliminar reseña</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={{ marginTop: 12 }}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#F3F4F6",
    },

    loader: { marginTop: 50 },

    error: {
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },

    // ← VOLVER
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },

    backText: {
        color: "#0A1F57",
        fontSize: 14,
        marginLeft: 4,
    },

    // ← HEADER
    header: {
        alignItems: "center",
        marginBottom: 24,
        marginTop: 4,
    },

    avatar: {
        width: 90,
        height: 90,
        borderRadius: 50,
        marginBottom: 16,
        backgroundColor: "#ccc",
    },

    name: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },

    username: {
        fontSize: 16,
        color: "#666",
        marginTop: 4,
        marginBottom: 6,
    },

    // ← SECTIONS
    section: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        shadowOpacity: 0.08,
        shadowRadius: 7,
        elevation: 1,
    },

    sectionTitle: {
        fontSize: 17,
        fontWeight: "600",
        marginBottom: 10,
        color: "#0A1F57",
    },

    text: {
        fontSize: 16,
        color: "#444",
    },

    // ← TAGS (servicios)
    tags: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },

    tag: {
        backgroundColor: "#f0f0f0",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },

    tagText: {
        color: "#333",
        fontSize: 14,
    },

    // ← BOTÓN PUBLICAR RESEÑA
    postButton: {
        backgroundColor: "#0A1F57",
        padding: 10,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
    },

    postButtonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
    },

    // ← TARJETA DE CADA RESEÑA
    reviewCard: {
        backgroundColor: "#F6F6F6",
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
    },

    reviewerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },

    reviewerPhoto: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: "#ddd",
    },

    reviewerName: {
        fontWeight: "bold",
        fontSize: 15,
        color: "#0A1F57",
    },

    // ← MODAL
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        padding: 20,
    },

    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
    },

    input: {
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 8,
        padding: 10,
        minHeight: 80,
        textAlignVertical: "top",
        fontSize: 14,
        marginTop: 10,
    },

    saveButton: {
        backgroundColor: "#0A1F57",
        padding: 12,
        borderRadius: 10,
        marginTop: 12,
    },

    saveButtonText: {
        textAlign: "center",
        color: "#FFF",
        fontWeight: "600",
        fontSize: 16,
    },
});
