import { Stack } from "expo-router";
import { RegisterProvider } from "@/context/RegisterContext";

export default function AuthLayout() {
  return (
    <RegisterProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Flujo de autenticación */}
        <Stack.Screen name="login" />
        <Stack.Screen name="forgot-password" />

        {/* Flujo de registro dividido por pasos */}
        <Stack.Screen name="register/step1-account" />
        <Stack.Screen name="register/step2-personal" />
        <Stack.Screen name="register/step3-role" />
        <Stack.Screen name="register/step4-services" />
        <Stack.Screen name="register/summary" />
      </Stack>
    </RegisterProvider>
  );
}
