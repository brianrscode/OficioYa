import React, { useState } from "react";
import {Text,View,TextInput,TouchableOpacity,ScrollView,StyleSheet,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function CambiarContrasenaScreen() {
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const [showActual, setShowActual] = useState(false);
  const [showNueva, setShowNueva] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  const handleSubmit = () => {
    // Aquí luego conectamos con el backend
    console.log("Enviar cambio de contraseña");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/perfil")}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <Text style={styles.title}>Cambiar Contraseña</Text>
      </View>

      {/* Contraseña actual */}
      <Text style={styles.label}>Contraseña actual</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          placeholder="Ingresa tu contraseña actual"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={!showActual}
          value={actual}
          onChangeText={setActual}
        />

        <TouchableOpacity onPress={() => setShowActual(!showActual)}>
          <Ionicons
            name={showActual ? "eye-off-outline" : "eye-outline"}
            size={24}
            color="#6B7280"
          />
        </TouchableOpacity>
      </View>

      {/* Nueva contraseña */}
      <Text style={styles.label}>Nueva contraseña</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          placeholder="Ingresa tu nueva contraseña"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={!showNueva}
          value={nueva}
          onChangeText={setNueva}
        />

        <TouchableOpacity onPress={() => setShowNueva(!showNueva)}>
          <Ionicons
            name={showNueva ? "eye-off-outline" : "eye-outline"}
            size={24}
            color="#6B7280"
          />
        </TouchableOpacity>
      </View>

      {/* Confirmar nueva contraseña */}
      <Text style={styles.label}>Confirmar nueva contraseña</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          placeholder="Confirma tu nueva contraseña"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={!showConfirmar}
          value={confirmar}
          onChangeText={setConfirmar}
        />

        <TouchableOpacity onPress={() => setShowConfirmar(!showConfirmar)}>
          <Ionicons
            name={showConfirmar ? "eye-off-outline" : "eye-outline"}
            size={24}
            color="#6B7280"
          />
        </TouchableOpacity>
      </View>

      {/* Botón Cambiar */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
        <Text style={styles.saveBtnText}>Cambiar Contraseña</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor: "#F4F5F7",paddingHorizontal: 20,},
  header: {flexDirection: "row",alignItems: "center",paddingVertical: 15,},
  title: {flex: 1,textAlign: "center",fontSize: 20,fontWeight: "700",marginRight: 30,},
  label: {fontSize: 16,fontWeight: "600",marginTop: 25,marginBottom: 8,},
  inputWrapper: {backgroundColor: "#FFFFFF",borderRadius: 20,borderWidth: 1,borderColor: "#E5E7EB",paddingHorizontal: 18,
    paddingVertical: 14,flexDirection: "row",alignItems: "center",minHeight: 80,},
  textInput: {flex: 1,fontSize: 16,textAlignVertical: "top",},
  saveBtn: {backgroundColor: "#0A1F57",paddingVertical: 15,borderRadius: 30,alignItems: "center",marginTop: 40,marginBottom: 30,},
  saveBtnText: {color: "#FFFFFF",fontSize: 16,fontWeight: "700",},
});
