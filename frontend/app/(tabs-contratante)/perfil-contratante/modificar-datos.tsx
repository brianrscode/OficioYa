import { API_BASE_URL } from "@/constants/Config";
import { Text, ScrollView, View, StyleSheet, Image, TextInput, TouchableOpacity, Alert, Platform} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "@/context/AuthContext";
import React, {useState, useEffect} from "react";
import { Ionicons } from "@expo/vector-icons";
import {router} from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function ModificarDatosScreen(){
    const { accessToken, checkSession} = useAuth();
    
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

    const [errorTelefono, setErrorTelefono] = useState(false);
    const [errorCorreo, setErrorCorreo] = useState(false);
    const [errorCiudad, setErrorCiudad] = useState(false);

    const[foto, setFoto]= useState<string | null>(null);
    const[fotoNueva, setFotoNueva] = useState<string | null>(null);

    const pickImage = async () => {
     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Necesitamos acceso a tu galería para subir fotos.");
        return;
      }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      console.log("Foto nueva URI:", uri);
      setFotoNueva(uri);
    }
  };


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
            setFoto(data.foto || null);

        } catch(error) {
            console.log("Error al traer los datos", error);
        }
    };

    useEffect(() => {
      loadCiudades();
    }, []);

    useEffect(() => {
      if(!accessToken) return;
      loadMe();
    },[accessToken]);

    const guardarDatos = async () => {
      if (!accessToken) return;

      let valido = true;

      setErrorTelefono(false);
      setErrorCorreo(false);
      setErrorCiudad(false);

      if (!telefono.trim()) {
        setErrorTelefono(true);
        valido = false;
      }

      if (!correo.trim()) {
        setErrorCorreo(true);
        valido = false;
      }

      if (!ciudadId) {
        setErrorCiudad(true);
        valido = false;
      }

      if (!valido) {
        Alert.alert("Debes completar todos los campos requeridos para continuar");
        return;
      }

      const telefonoRegex = /^[0-9]{10,}$/;
      if (!telefonoRegex.test(telefono)) {
        Alert.alert("El número de teléfono ingresado no es válido");
        return;
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(correo)) {
        Alert.alert("El correo ingresado no es válido.");
        return;
      }

      try {
        const formData = new FormData();

        formData.append("telefono", telefono);
        formData.append("email", correo);
        formData.append("ciudad", ciudadId.toString());

        if (fotoNueva) {
          const filename = fotoNueva.split("/").pop() || "foto.jpg";
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : `image`;

          if (Platform.OS === "web") {
            const response = await fetch(fotoNueva);
            const blob = await response.blob();
            formData.append("foto", blob, filename);
          } else {
            formData.append("foto", {
              uri: fotoNueva,
              name: filename,
              type,
            });
          }
        }

        const res = await fetch(`${API_BASE_URL}/api/usuarios/update/`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        });

        if (!res.ok) {
          const err = await res.text();
          console.log("Error al actualizar:", err);
          Alert.alert("Error al actualizar tus datos");
          return;
        }

        Alert.alert("Éxito", "Datos actualizados correctamente");
        router.push("/perfil");

      } catch (error) {
        console.log("Error al guardar los datos:", error);
      }
    };

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

      {/* Foto */}
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Image
          source={{ uri: fotoNueva || foto || "https://via.placeholder.com/150" }}
          style={{ width: 120, height: 120, borderRadius: 70, marginBottom: 10 }}
        />
        <TouchableOpacity onPress={pickImage}>
          <Text style={{ color: "#0A1F57", fontSize: 16, fontWeight: "700" }}>
            Cambiar foto de perfil
          </Text>
        </TouchableOpacity>
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

      {/* Cuidad */}
      <Text style={styles.label}>Ciudad</Text>
      <View style={[styles.pickerContainer, errorCiudad && styles.errorInput]}>
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
        style={[styles.input, errorTelefono && styles.errorInput]}
        value={telefono}
        onChangeText={(t) => {setTelefono(t);
          if (t.trim()) setErrorTelefono(false);
        }}
        placeholder="Número de teléfono"
      />

      {/* Correo */}
      <View style={styles.labelRow}>
        <Text style={styles.label}>Correo electrónico</Text>
      </View>
      <TextInput
        style={[styles.input, errorCorreo && styles.errorInput]}
        value={correo}
        onChangeText={(c) => {setCorreo(c);
          if(c.trim()) setErrorCorreo(false);        
        }}
        placeholder="Correo electronico"
      />

      {/* Botón Guardar */}
      <TouchableOpacity style={styles.saveBtn} onPress={guardarDatos}>
        <Text style={styles.saveBtnText}>Guardar Cambios</Text>
      </TouchableOpacity>

    </ScrollView>
    );
}

const styles = StyleSheet.create({
    container:{ flex: 1, backgroundColor: "#ffffffff", paddingHorizontal: 20,},
    header:{flexDirection: "row", alignItems: "center", paddingVertical: 15, marginTop: 40,},
    title:{flex:1, textAlign: "center", fontSize: 20, fontWeight: "700", marginRight: 30, marginTop: 4, },
    label:{ fontSize: 16, fontWeight: "600", marginTop:20, marginBottom: 6,},
    labelRow:{flexDirection: "row", justifyContent: "space-between", marginTop: 20, marginBottom: 6,},
    noEditable:{color:"#9CA3AF", fontSize: 14,},
    input:{backgroundColor: "#ffffffff", paddingHorizontal: 18, paddingVertical: 14, borderRadius: 30, borderWidth: 1, flexDirection: "row", alignItems: "center",},
    textInputValue:{flex: 1, fontSize: 14,},
    inputDisabled:{opacity: 0.5,},
    genderRow:{flexDirection:"row", justifyContent: "space-between",},
    genderBtn: {flex: 1,paddingVertical: 12,borderRadius: 30,borderWidth: 1,borderColor: "#D1D5DB",alignItems: "center",marginHorizontal: 5,},
    genderSelected: {backgroundColor: "#E5E7FF",borderColor: "#1E3A8A",},
    genderText: {fontSize: 14,color: "#4B5563",fontWeight: "500",},
    genderSelectedText: {color: "#1E3A8A",fontWeight: "700",},
    dateInput: {backgroundColor: "#F9FAFB",paddingHorizontal: 18,paddingVertical: 14,borderRadius: 30,borderWidth: 1,flexDirection: "row",
    alignItems: "center",},
    saveBtn: {backgroundColor: "#0A1F57",paddingVertical: 15,borderRadius: 30,alignItems: "center",marginTop: 40,},
    saveBtnText: {color: "#FFFFFF",fontSize: 16,fontWeight: "700",},
    pickerContainer: {backgroundColor: "#F9FAFB",borderRadius: 30,borderWidth: 1,
    marginTop: 5,paddingHorizontal: 12,height: 55,justifyContent: "center",},
    picker: {width: "100%",fontSize: 14, height: 20, borderColor:"#FFFFFF"},
    errorInput: {borderColor: "red", borderWidth: 2},
})
