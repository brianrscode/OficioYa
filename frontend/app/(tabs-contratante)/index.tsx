import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { API_BASE_URL } from "@/constants/Config";
import { router } from "expo-router";

type ServicioItem = {
    id: number;
    nombre: string;
};

export default function InicioContratanteScreen() {

    const [servicios, setServicios] = useState<ServicioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        obtenerServicios();
    }, []);

    const obtenerServicios = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/servicios/servicios/`);
            if (!res.ok) throw new Error("No se pudieron cargar los servicios");
            const data = await res.json();
            
            // Mostrar máximo 6
            const primeros = data.slice(0, 4);
            setServicios(primeros);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const irABuscarConServicio = (servicio: string) => {
        router.push({
            pathname: "/(tabs-contratante)/buscar",
            params: { servicio }
        });
    };

    return (
        <ScrollView style={styles.container}>

            <Text style={styles.title}>¿Qué servicio necesitas hoy?</Text>

            {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
            {error !== "" && <Text style={styles.error}>{error}</Text>}

            <View style={styles.servicesContainer}>
                {servicios.map((serv) => (
                    <TouchableOpacity
                        key={serv.id}
                        style={styles.serviceButton}
                        onPress={() => irABuscarConServicio(serv.nombre)}
                    >
                        <Text style={styles.serviceText}>{serv.nombre}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.subtitle}>Prestadores cerca de ti</Text>
            <View style={styles.cardPlaceholder}>
                <Text style={{ color: "#666" }}>En desarrollo...</Text>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#F3F4F6" },
    title: { fontSize: 20, fontWeight: "700", marginBottom: 16, color: "#0A1F57", marginTop: 40,},
    error: { color: "red", textAlign: "center", marginBottom: 10 },
    servicesContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 12, marginBottom: 20,},
    serviceButton: {  width: "48%",  backgroundColor: "#ffffff", paddingVertical: 14,  borderRadius: 14, alignItems: "center",
    justifyContent: "center", shadowOpacity: 0.12, shadowRadius: 6, elevation: 2,},
    serviceText: { fontSize: 16, fontWeight: "600", color: "#0A1F57",},
    subtitle: { fontSize: 18, fontWeight: "700", marginBottom: 12, marginTop: 12, color: "#0A1F57",},
    cardPlaceholder: { backgroundColor: "#fff", padding: 20, borderRadius: 14, alignItems: "center", justifyContent: "center", shadowOpacity: 0.08,
    shadowRadius: 4,},
});
