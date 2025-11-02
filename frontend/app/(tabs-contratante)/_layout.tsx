import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";

export default function TabsContratanteLayout() {
  const { user, accessToken, checkSession } = useAuth();
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
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user || !accessToken || user.rol !== "contratante") {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: "#007AFF" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="buscar"
        options={{
          title: "Buscar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
