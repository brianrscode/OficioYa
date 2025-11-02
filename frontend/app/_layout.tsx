import { Stack, Redirect } from "expo-router";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";

function RootNavigation() {
  const { user, checkSession } = useAuth();
  const [loading, setLoading] = useState(true);

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

  // No autenticado → ir al login
  if (!user) return <Redirect href="/auth/login" />;

  // Autenticado → redirigir según rol
  if (user.rol === "prestador") return <Redirect href="/(tabs-prestador)" />;
  if (user.rol === "contratante") return <Redirect href="/(tabs-contratante)" />;

  // Rol desconocido → fallback
  return <Redirect href="/auth/login" />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs-contratante)" />
        <Stack.Screen name="(tabs-prestador)" />
      </Stack>
      <RootNavigation />
    </AuthProvider>
  );
}
