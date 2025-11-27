import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/constants/Config";

/**
 * Realiza una petición autenticada con manejo automático de token expirado
 * Si el token está expirado, intenta refrescarlo automáticamente y reintenta la petición
 */
export async function authFetch(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    // Obtener el access token actual
    let accessToken = await AsyncStorage.getItem("access");

    // Agregar el token de autorización a los headers
    const headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
    };

    // Realizar la petición inicial
    let response = await fetch(url, { ...options, headers });

    // Si obtenemos un 401, intentar refrescar el token
    if (response.status === 401) {
        console.log("Token expirado, intentando refrescar...");

        const refreshToken = await AsyncStorage.getItem("refresh");
        if (!refreshToken) {
            throw new Error("No hay refresh token disponible");
        }

        // Intentar refrescar el token
        const refreshResponse = await fetch(`${API_BASE_URL}/api/usuarios/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!refreshResponse.ok) {
            // Si el refresh token también está expirado, limpiar la sesión
            await AsyncStorage.multiRemove(["access", "refresh", "user"]);
            throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
        }

        const refreshData = await refreshResponse.json();
        const newAccessToken = refreshData.access;

        // Guardar el nuevo access token
        await AsyncStorage.setItem("access", newAccessToken);

        // Reintentar la petición original con el nuevo token
        const newHeaders = {
            ...options.headers,
            Authorization: `Bearer ${newAccessToken}`,
        };

        response = await fetch(url, { ...options, headers: newHeaders });
    }

    return response;
}
