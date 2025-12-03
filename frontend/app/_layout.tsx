import { Stack, Redirect, usePathname } from "expo-router";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import FlashMessage from "react-native-flash-message";


function RootNavigation() {
  const { user, checkSession } = useAuth();
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const validar = async () => {
      await checkSession();
      setLoading(false);
    };
    validar();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const inAuth = pathname?.startsWith("/auth");

  // No autenticado → permitir rutas /auth/* sin forzar redirect
  if (!user) {
    if (!inAuth) return <Redirect href="/auth/login" />;
    return null;
  }

  // Autenticado → si está en /auth/* redirigir según rol
  if (inAuth) {
    if (user.rol === "prestador") return <Redirect href="/(tabs-prestador)" />;
    if (user.rol === "contratante") return <Redirect href="/(tabs-contratante)" />;
  }

  // Autenticado y fuera de /auth → opcionalmente no redirigir, o redirigir por rol
  if (user.rol === "prestador") return <Redirect href="/(tabs-prestador)" />;
  if (user.rol === "contratante") return <Redirect href="/(tabs-contratante)" />;

  // Rol desconocido → fallback a login
  return <Redirect href="/auth/login" />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <FlashMessage position="top" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs-contratante)" />
        <Stack.Screen name="(tabs-prestador)" />
      </Stack>
      <RootNavigation />
    </AuthProvider>
  );
}
