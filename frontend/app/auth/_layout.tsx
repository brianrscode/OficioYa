import { Stack, Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { View, ActivityIndicator } from "react-native";
import { RegisterProvider } from "@/context/RegisterContext";
import FlashMessage from "react-native-flash-message";

export default function AuthLayout() {
  const { user, accessToken } = useAuth();

  if (!user && !accessToken) {
    // No logueado → mostrar screens de auth
    return (
      <RegisterProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <FlashMessage position="top" />
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

  // Ya logueado → redirigir según rol
  if (user?.rol === "prestador") {
    return <Redirect href="/(tabs-prestador)" />;
  }
  if (user?.rol === "contratante") {
    return <Redirect href="/(tabs-contratante)" />;
  }
  return <Redirect href="/auth/login" />;
}
