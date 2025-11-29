import { API_BASE_URL } from "@/constants/Config";
import { Text, ScrollView, Button, View, StyleSheet, Image, TextInput, TouchableOpacity, Alert, Platform} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "@/context/AuthContext";
import React, {useState, useEffect} from "react";
import { Ionicons } from "@expo/vector-icons";
import {router} from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function ModificarDatosScreen(){
    const { accessToken, user } = useAuth();

  const [nombres, setNombre] = useState("");
  const [apellidoP, setApellidoP] = useState("");
  const [apellidoM, setApellidoM] = useState("");
  const [username, setUsername] = useState("");
  const [ciudadId, setCiudadId] = useState<number | null>(null);
  const [ciudades, setCiudades] = useState<any[]>([]);
  const [sexo, setSexo] = useState<"F" | "M">("M");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState("");
  const[foto, setFoto]= useState<string | null>(null);
  const[fotoNueva, setFotoNueva] = useState<string | null>(null);

  const [misServicios, setMisServicios] = useState<any[]>([]);
  const [todosServicios, setTodosServicios] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [servicioSelect, setServicioSelect] = useState<number | null>(null);

  const[errorCiudad, setErrorCiudad] = useState(false);
  const[errorTelefono, setErrorTelefono] = useState(false);
  const[errorCorreo, setErrorCorreo] = useState(false);

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

  const loadCiudades = async () => {
    try {
      const url = new URL("/api/ubicacion/ciudades/", API_BASE_URL);
      const res = await fetch(url.toString());
      const data = await res.json();
      setCiudades(data);
    } catch (error) {
      console.log("Error al cargar ciudades:", error);
    }
  };

  const getCiudades = () => {
    const ciudadObj = ciudades.find((c) => c.id === ciudadId);
    if (!ciudadObj) return "Selecciona tu ciudad";
    return `${ciudadObj.nombre}, ${ciudadObj.estado.nombre}, ${ciudadObj.pais.nombre}`;
  };

  const loadMisServicios = async () => {
    if (!accessToken || !user) return;

    try {
      const url = new URL("/api/servicios/prestadores/", API_BASE_URL);
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const data = await res.json();
      console.log("Servicios del back", data);

      const ofrecido = data.filter(
        (item: any) => Number(item.usuario) === Number(user.id)
      );

      setMisServicios(ofrecido);
      console.log("servicios del usuario", ofrecido);
    } catch (error) {
      console.log("Error al cargar tus servicios:", error);
    }
  };

  const loadTodosServicios = async () => {
    try {
      const url = new URL("/api/servicios/servicios/", API_BASE_URL);
      const res = await fetch(url.toString());
      const data = await res.json();
      setTodosServicios(data);
    } catch (error) {
      console.log("Error al cargar todos los servicios:", error);
    }
  };

  const agregarServicio = async () => {
    if (!servicioSelect || !accessToken || !user) {
      Alert.alert("Selecciona un servicio para continuar");
      return;
    }

    try {
      const url = new URL("/api/servicios/prestadores/", API_BASE_URL);

      const body = {
        usuario: user.id,
        servicio_id: servicioSelect,
      };

      console.log("Enviando:", body);

      const res = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        console.log("Error al agregar servicio:", await res.text());
        Alert.alert("Error al agregar el servicio");
        return;
      }

      setModalVisible(false);
      setServicioSelect(null);
      loadMisServicios();
    } catch (error) {
      console.log("Error front:", error);
    }
  };

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

  const loadMe = async () => {
    if (!accessToken) return;

    try {
      const url = new URL("/api/usuarios/me/", API_BASE_URL);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        console.log("Error /me/", await res.json());
        return;
      }

      const data = await res.json();
      console.log("Datos /me:", data);

      setNombre(data.nombres);
      setApellidoP(data.apellido_paterno);
      setApellidoM(data.apellido_materno);
      setUsername(data.username);
      setSexo(data.sexo || "M");
      setFechaNacimiento(data.fecha_nacimiento);
      setTelefono(data.telefono);
      setCorreo(data.email);
      setCiudadId(data.ciudad);
      setRol(data.rol);
    } catch (error) {
      console.log("Error al traer los datos:", error);
    }
  };

  useEffect(() => {
    loadCiudades();
  }, []);

  useEffect(() => {
    if (accessToken) loadMe();
  }, [accessToken]);

  useEffect(() => {
    if (user?.rol === "prestador" && accessToken) {
      loadMisServicios();
    }
  }, [user, accessToken]);

  return (
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
      />

      {/* Apellido paterno */}
      <Text style={styles.label}>Apellido paterno</Text>
      <TextInput
        style={[styles.input, styles.inputDisabled]}
        value={apellidoP}
        editable={false}
      />

      {/* Apellido materno */}
      <Text style={styles.label}>Apellido materno</Text>
      <TextInput
        style={[styles.input, styles.inputDisabled]}
        value={apellidoM}
        editable={false}
      />

      {/* Username */}
      <Text style={styles.label}>Nombre de usuario</Text>
      <TextInput
        style={[styles.input, styles.inputDisabled]}
        value={username}
        editable={false}
      />

      {/* Ciudad */}
      <Text style={styles.label}>Ciudad</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={ciudadId}
          onValueChange={(value) => setCiudadId(value)}
          style={styles.picker}
          dropdownIconColor="#032B44"
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

      {/* Fecha nacimiento */}
      <Text style={styles.label}>Fecha de nacimiento</Text>
      <View style={[styles.dateInput, styles.inputDisabled]}>
        <TextInput
          style={{ flex: 1 }}
          value={fechaNacimiento}
          editable={false}
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
      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        style={styles.input}
        value={correo}
        onChangeText={setCorreo}
        placeholder="Correo electrónico"
      />

      {/* Servicios del prestador */}
      {rol === "prestador" && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.label}>Mis Servicios</Text>

          <View style={styles.chipContainer}>
            {misServicios.map((item) => (
              <View key={item.id} style={styles.chip}>
                <Text style={styles.chipText}>{item.servicio.nombre}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              loadTodosServicios();
              setModalVisible(true);
            }}
          >
            <Ionicons name="add-circle" size={20} color="#0A1F57" />
            <Text style={{ marginLeft: 8, color: "#0A1F57" }}>Añadir servicio</Text>
          </TouchableOpacity>

          {/* Modal */}
          {modalVisible && (
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Selecciona un servicio</Text>

                <Picker
                  selectedValue={servicioSelect}
                  onValueChange={(value) => setServicioSelect(value)}
                >
                  <Picker.Item label="Selecciona un servicio" value={null} />
                  {todosServicios.map((s) => (
                    <Picker.Item key={s.id} label={s.nombre} value={s.id} />
                  ))}
                </Picker>

                <TouchableOpacity style={styles.saveBtn} onPress={agregarServicio}>
                  <Text style={styles.saveBtnText}>Guardar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.saveBtn, { backgroundColor: "#999", marginTop: 3 }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.saveBtnText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Botón Guardar */}
      <TouchableOpacity style={styles.saveBtn} onPress={guardarDatos} >
        <Text style={styles.saveBtnText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    marginRight: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#000000",
  },
  inputDisabled: {
    opacity: 0.5,
  },
  textInputValue: {
    flex: 1,
    color: "#111826",
    fontSize: 14,
  },
  pickerContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#000000",
    marginTop: 5,
    paddingHorizontal: 12,
    height: 55,
    justifyContent: "center",
  },
  picker: {
    width: "100%",
    color: "#000000",
  },
  dateInput: {
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#000000",
    flexDirection: "row",
    alignItems: "center",
  },

  /* Chips */
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    marginBottom: 10,
  },
  chip: {
    backgroundColor: "#EAF1FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    color: "#0A1F57",
    fontWeight: "600",
    fontSize: 13,
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  /* Modal */
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "50%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 15,
  },

  saveBtn: {
    backgroundColor: "#0A1F57",
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 40,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});