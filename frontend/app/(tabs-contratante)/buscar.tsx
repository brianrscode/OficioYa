import { API_BASE_URL } from "@/constants/Config";
import { View, TextInput, TouchableOpacity, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigation } from "expo-router";
import { router } from "expo-router";
import { Image } from "expo-image";


export default function BuscarScreen() {
    // TODO: Implementar búsqueda de servicios
    const { accessToken } = useAuth();
    const navigation = useNavigation();
    const [servicio, setServicio] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const endpoint = useMemo(() => {

        const url = new URL(`${API_BASE_URL}/api/servicios/buscar/`);
        if (servicio) url.searchParams.set("servicio", servicio);
        if (ciudad) url.searchParams.set("ciudad", ciudad);
        return url.toString();
    }, [servicio, ciudad]);

    const fetchServicios = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await fetch(endpoint, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!res.ok) throw new Error("Error de búsqueda");
            const data = await res.json();
            const items = Array.isArray(data) ? data : (data.results ?? []);
            setResults(items);
        } catch (e: any) {
            setError(e?.message || "Error");
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServicios();
    }, []);

    const navigateToPrestadorBuscado = (id: number) => {
        router.push({ pathname: "/(tabs-contratante)/prestador-buscado", params: { id } });
    };

    return (
        <View style={styles.container}>
            <View style={styles.filtersRow}>
                <TextInput
                    placeholder="Servicio"
                    value={servicio}
                    onChangeText={setServicio}
                    style={styles.input}
                    autoCapitalize="none"
                />
                <TextInput
                    placeholder="Ciudad"
                    value={ciudad}
                    onChangeText={setCiudad}
                    style={styles.input}
                    autoCapitalize="none"
                />
                <TouchableOpacity style={styles.button} onPress={fetchServicios} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? "Buscando..." : "Buscar"}</Text>
                </TouchableOpacity>
            </View>

            {loading && results.length === 0 ? (
                <ActivityIndicator size="large" style={styles.loader} />
            ) : null}

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <FlatList
                data={results}
                keyExtractor={(_, idx) => String(idx)}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <TouchableOpacity onPress={() => navigateToPrestadorBuscado(item.id)}>
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>
                                    {item.nombres[0]}{item.apellido_paterno[0]}
                                </Text>
                            </View>
                            <Text style={styles.title}>{item.prestador}</Text>
                            <Text style={styles.subtitle}>{item.servicios.join(", ")}</Text>
                            <Text style={styles.meta}>{item.ciudad}</Text>
                            <Text style={styles.meta}>{item.nombres} {item.apellido_paterno} {item.apellido_materno}</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={!loading ? <Text style={styles.empty}>Sin resultados</Text> : null}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    filtersRow: { gap: 8 },
    input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 },
    button: { backgroundColor: "#007AFF", padding: 12, borderRadius: 8, alignItems: "center" },
    buttonText: { color: "white", fontWeight: "600" },
    loader: { marginTop: 24 },
    error: { color: "#c00", marginVertical: 8 },
    list: { paddingVertical: 12, gap: 8 },
    card: { padding: 12, borderWidth: 1, borderColor: "#eee", borderRadius: 10, marginBottom: 8 },
    title: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
    subtitle: { color: "#555", marginBottom: 4 },
    meta: { color: "#333" },
    empty: { textAlign: "center", marginTop: 24, color: "#666" },
    id: { fontSize: 12, color: "#333", marginBottom: 4 },
    avatarPlaceholder: {
        width: 80, height: 80, borderRadius: 40, backgroundColor: "#007AFF",
        justifyContent: "center", alignItems: "center", marginBottom: 12
    },
    avatarText: { color: "white", fontSize: 32, fontWeight: "bold" },
});



