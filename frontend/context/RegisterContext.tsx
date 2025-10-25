import { createContext, useContext, useState } from "react";

const RegisterContext = createContext(null);

export function RegisterProvider({ children }: { children: React.ReactNode }) {
  const [registro, setRegistro] = useState({
    username: "",
    email: "",
    password: "",
    nombres: "",
    apellido_paterno: "",
    apellido_materno: "",
    foto: null,
    sexo: "",
    fecha_nacimiento: "",
    ciudad: "",
    ciudad_nombre: "",
    rol: "contratante",
    servicios: [],
  });

  return (
    <RegisterContext.Provider value={{ registro, setRegistro }}>
      {children}
    </RegisterContext.Provider>
  );
}

export function useRegistro() {
  return useContext(RegisterContext);
}
