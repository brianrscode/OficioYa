import { API_BASE_URL } from "@/constants/Config";
import { Text, ScrollView, Button, View, StyleSheet, Image, TextInput, TouchableOpacity,} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "@/context/AuthContext";
import React, {useState, useEffect} from "react";
import { Ionicons } from "@expo/vector-icons";
import {router} from "expo-router";

export default function ModificarDatosScreen(){
    const { accessToken} = useAuth();
    
    const[nombres, setNombre] = useState("");
    const[apellidoP, setApellidoP] = useState("");
    const[apellidoM, setApellidoM] = useState("");
    const[username, setUsername] = useState("");
    const[ciudadId, setCiudadId] = useState<number | null>(null);
    const[ciudades, setCiudades] = useState<any[]>([]);
    const[sexo, setSexo] = useState<"F" | "M">("M");
    const[fechaNacimiento, setFechaNacimiento] = useState("");
    const[telefono, setTelefono] = useState("");
    const[correo, setCorreo] = useState("");

    const loadCiudades = async () =>{
        try{
            const url = new URL("/api/ubicacion/ciudades/", API_BASE_URL);

            const res = await fetch(url.toString());
            const data = await res.json();

            setCiudades(data);
        }catch(error){
            console.log("Error al cargar las ciudades", error);
        }
    };

    useEffect(() => {
        loadCiudades();
    }, []);

    const loadMe = async() =>{
        if(!accessToken) return;

        try{
            const url = new URL("/api/usuarios/me/", API_BASE_URL);

            const res = await fetch(url.toString(),{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if(!res.ok){
                console.log("Error /me/", await res.json());
                return;
            }

            const data = await res.json();
            console.log("Datos recibidos desde /me/:", data);
            setNombre(data.nombres);
            setApellidoP(data.apellido_paterno);
            setApellidoM(data.apellido_materno);
            setUsername(data.username);
            setSexo(data.sexo || "M");
            setFechaNacimiento(data.fecha_nacimiento);
            setTelefono(data.telefono);
            setCorreo(data.email);
            setCiudadId(data.ciudad);

        } catch(error) {
            console.log("Error al traer los datos", error);
        }
    };

    useEffect(() => {
        if(!accessToken) return;
        loadMe();
    },[accessToken]);

    const getCiudades = () => {
        const ciudadObj = ciudades.find((c) => c.id === ciudadId);
        if(!ciudadObj) return "Seleccion tu ciudad";
        return `${ciudadObj.nombre},${ciudadObj.estado.nombre},${ciudadObj.pais.nombre}`;
    };

    return(
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/perfil")}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <Text style={styles.title}>Editar Datos Personales</Text>
      </View>

      {/* Nombre */}
      <Text style={styles.label}>Nombre(s)</Text>
      <TextInput
        style={[styles.input, styles.inputDisabled]}
        value={nombres}
        editable={false}
        onChangeText={setNombre}
        placeholder="Nombre"
      />

      <Text style={styles.label}>Apellido paterno</Text>
      <TextInput
        style={[styles.input, styles.inputDisabled]}
        value={apellidoP}
        editable={false}
        onChangeText={setApellidoP}
        placeholder="Apellido paterno"
      />

      <Text style={styles.label}>Apellido materno</Text>
      <TextInput
      style={[styles.input, styles.inputDisabled]}
      value={apellidoM}
      editable={false}
      onChangeText={setApellidoM}
      placeholder="Apellido materno"
      />

      {/* Username */}
      <Text style={styles.label}>Nombre de usuario</Text>
      <TextInput
        style={[styles.input, styles.inputDisabled]}
        value={username}
        editable={false}
        onChangeText={setUsername}
        placeholder="username"
      />

      {/* Localidad */}
      <Text style={styles.label}>Ciudad</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={ciudadId}
          onValueChange={(value) => setCiudadId(value)}
          style={styles.picker}
          dropdownIconColor="#032B44"
          mode="dropdown"    
        >
          <Picker.Item label="Selecciona tu ciudad" value={null} />

          {ciudades.map((c) => (
            <Picker.Item
              key={c.id}
              value={c.id}
              label={`${c.nombre}, ${c.estado.nombre}, ${c.estado.pais.nombre}`}
            />
          ))}
        </Picker>
      </View>

      {/* Sexo */}
      <Text style={styles.label}>Sexo</Text>
      <View style={[styles.input, styles.inputDisabled]}>
        <Text style={styles.textInputValue}>
          {sexo === "M" ? "Masculino" : "Femenino"}
        </Text>
      </View>

      {/* Fecha de nacimiento */}
      <Text style={styles.label}>Fecha de nacimiento</Text>
      <View style={[styles.dateInput, styles.inputDisabled]}>
        <TextInput
          style={{ flex: 1 }}
          value={fechaNacimiento}
          editable={false}
          onChangeText={setFechaNacimiento}
          placeholder="YYYY/MM/DD"
        />
        <Ionicons name="calendar-outline" size={22} color="#555" />
      </View>

      {/* Teléfono */}
      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={styles.input}
        value={telefono}
        onChangeText={setTelefono}
        placeholder="Número de teléfono"
      />

      {/* Correo */}
      <View style={styles.labelRow}>
        <Text style={styles.label}>Correo electrónico</Text>
      </View>
      <TextInput
        style={styles.input}
        value={correo}
        onChangeText={setCorreo}
        placeholder="Correo electronico"
      />

      {/* Botón Guardar */}
      <TouchableOpacity style={styles.saveBtn}>
        <Text style={styles.saveBtnText}>Guardar Cambios</Text>
      </TouchableOpacity>

    </ScrollView>
    );
}

const styles = StyleSheet.create({
    container:{ flex: 1, backgroundColor: "#ffffffff", paddingHorizontal: 20,},
    header:{flexDirection: "row", alignItems: "center", paddingVertical: 15,},
    title:{flex:1, textAlign: "center", fontSize: 20, fontWeight: "700", marginRight: 30,},
    label:{ fontSize: 16, fontWeight: "600", marginTop:20, marginBottom: 6,},
    labelRow:{flexDirection: "row", justifyContent: "space-between", marginTop: 20, marginBottom: 6,},
    noEditable:{color:"#9CA3AF", fontSize: 14,},
    input:{backgroundColor: "#ffffffff", paddingHorizontal: 18, paddingVertical: 14, borderRadius: 30, borderWidth: 1, borderColor: "#000000ff", flexDirection: "row", alignItems: "center",},
    textInputValue:{flex: 1, color: "#111826", fontSize: 14,},
    inputDisabled:{opacity: 0.5,},
    genderRow:{flexDirection:"row", justifyContent: "space-between",},
    genderBtn: {flex: 1,paddingVertical: 12,borderRadius: 30,borderWidth: 1,borderColor: "#D1D5DB",alignItems: "center",marginHorizontal: 5,},
    genderSelected: {backgroundColor: "#E5E7FF",borderColor: "#1E3A8A",},
    genderText: {fontSize: 14,color: "#4B5563",fontWeight: "500",},
    genderSelectedText: {color: "#1E3A8A",fontWeight: "700",},
    dateInput: {backgroundColor: "#F9FAFB",paddingHorizontal: 18,paddingVertical: 14,borderRadius: 30,borderWidth: 1,borderColor: "#000000ff",flexDirection: "row",
    alignItems: "center",},
    saveBtn: {backgroundColor: "#0A1F57",paddingVertical: 15,borderRadius: 30,alignItems: "center",marginTop: 40,},
    saveBtnText: {color: "#FFFFFF",fontSize: 16,fontWeight: "700",},
    pickerContainer: {backgroundColor: "#F9FAFB",borderRadius: 30,borderWidth: 1,borderColor: "#000000ff",
    marginTop: 5,paddingHorizontal: 12,height: 55,justifyContent: "center",},
    picker: {width: "100%",color: "#000000ff",fontSize: 14, height: 20, borderColor:"#FFFFFF"},
})