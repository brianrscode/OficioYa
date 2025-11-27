import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator, ScrollView, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/constants/Config";
import { Ionicons } from "@expo/vector-icons";
import { authFetch } from "@/utils/authFetch";

export default function CrearPublicacionScreen() {
    const router = useRouter();
    const { accessToken } = useAuth();
    const [descripcion, setDescripcion] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        // Solicitar permisos
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permiso denegado", "Necesitamos acceso a tu galería para subir fotos.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!image) {
            Alert.alert("Error", "Debes seleccionar una imagen.");
            return;
        }
        if (!descripcion.trim()) {
            Alert.alert("Error", "Debes escribir una descripción.");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("descripcion", descripcion);

            // Preparar la imagen para el envío
            const filename = image.split('/').pop() || "photo.jpg";
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;

            if (Platform.OS === "web") {
                // En web necesitamos convertir la URI a un Blob
                const response = await fetch(image);
                const blob = await response.blob();
                formData.append("foto", blob, filename);
            } else {
                // @ts-ignore: React Native espera un objeto con uri, name y type para archivos
                formData.append("foto", { uri: image, name: filename, type });
            }
            formData.append("publico", "true");

            const res = await authFetch(`${API_BASE_URL}/api/publicaciones/`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(JSON.stringify(errorData));
            }

            Alert.alert("Éxito", "Publicación creada correctamente");
            router.back();
        } catch (e: any) {
            console.error("Error al publicar:", e);
            Alert.alert("Error", "No se pudo crear la publicación. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Nueva Publicación</Text>
                <View style={{ width: 24 }} />
            </View>

            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
                ) : (
                    <View style={styles.placeholder}>
                        <Ionicons name="camera-outline" size={48} color="#ccc" />
                        <Text style={styles.placeholderText}>Toca para seleccionar una foto</Text>
                    </View>
                )}
            </TouchableOpacity>

            <View style={styles.form}>
                <Text style={styles.label}>Descripción</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Escribe algo sobre tu trabajo..."
                    multiline
                    numberOfLines={4}
                    value={descripcion}
                    onChangeText={setDescripcion}
                    textAlignVertical="top"
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.buttonText}>Publicar</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: "#fff", padding: 20 },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
    backButton: { padding: 4 },
    title: { fontSize: 20, fontWeight: "bold", color: "#333" },
    imagePicker: { width: "100%", height: 250, borderRadius: 12, overflow: "hidden", backgroundColor: "#f5f5f5", marginBottom: 20, borderWidth: 1, borderColor: "#eee" },
    image: { width: "100%", height: "100%" },
    placeholder: { flex: 1, justifyContent: "center", alignItems: "center" },
    placeholderText: { marginTop: 10, color: "#888", fontSize: 16 },
    form: { flex: 1 },
    label: { fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#333" },
    input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, fontSize: 16, minHeight: 100, marginBottom: 24, backgroundColor: "#fafafa" },
    button: { backgroundColor: "#007AFF", padding: 16, borderRadius: 8, alignItems: "center" },
    buttonDisabled: { backgroundColor: "#a0cfff" },
    buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
