import { Stack, Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { View, ActivityIndicator } from "react-native";
import { RegisterProvider } from "@/context/RegisterContext";

export default function AuthLayout() {
  const { user, accessToken } = useAuth();

  if (!user && !accessToken) {
    // No logueado → mostrar screens de auth
    return (
      <RegisterProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="register/step1-account" />
          <Stack.Screen name="register/step2-personal" />
          <Stack.Screen name="register/step3-role" />
          <Stack.Screen name="register/step4-services" />
          <Stack.Screen name="register/summary" />
        </Stack>
      </RegisterProvider>
    );
  }

  // Ya logueado → evitar volver al login o registro
  return <Redirect href="/(tabs)" />;
}
