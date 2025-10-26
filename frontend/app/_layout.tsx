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

  // Si hay usuario logueado entonces va al index
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  // Si no hay usuario entonces va al login
  return <Redirect href="/auth/login" />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" />
      </Stack>
      <RootNavigation />
    </AuthProvider>
  );
}
