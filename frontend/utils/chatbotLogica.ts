export type BotMessage ={
    from: "user" | "bot";
    text: string;
};

const limpiar =(t: string) => t.trim();
const normalizar =(t: string) => t.toLowerCase();
const sinAcentos =(t : string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const reduceEspacios=(t: string) => t.replace(/\s+/g, "");

const pipeline = [limpiar, normalizar, sinAcentos, reduceEspacios];
const procesarTexto = (input: string) => pipeline.reduce((txt,fn)=> fn(txt), input);

type Regla ={
    patrones : RegExp[]; //palabras que activa la regla
    respuesta: string | ((input: string) => string); //respuesta del bot
};

//reglas del chatbot
const reglas: Regla[] = [
    {
        patrones: [/hola/i, /buenas/i, /hey/i, /ola/i, /Que eres?/i, /¿Qué eres?/i],
        respuesta: 
        "¡Hola! Soy Ofelia. Puedo ayudarte con busqueda de prestadores, publicación de imagenes, modificación de tus datos, entre otras cosas",

    },
    {
        patrones: [/registrarme/i, /crear cuenta/i, /registro/i, /Como me registro?/i, /¿Cómo me registro?/i],
        respuesta:
        "Para registrarte, ve a la pantalla de inicio y selecciona 'Crear cuenta'. Completa tus datos personales, elige si eres contratante o prestador de servicios y no olvides aceptar los términos y condiciones",
    },
    {
        patrones: [/publicar/i, /subir trabajo/i, /subir servicio/i],
        respuesta:
        "Si eres prestador, ve a la sección de Mis Publicaciones dentro de tu perfil y utiliza la opción para crear una nueva publicación con descripción y fotos.",
    },
    {
        patrones: [/buscar/i, /encontrar prestador/i, /servicio cerca/i],
        respuesta:
        "Como contratante, puedes usar la pantalla de búsqueda para filtrar por tipo de servicio y ciudad, y ver el perfil de los prestadores.",
    },
    {
        patrones: [/calificar/i, /opinión/i, /reseña/i],
        respuesta:
        "Después de finalizar un trabajo, podrás calificar al prestador y dejar una opinión desde la sección de historial o detalle del servicio.",
    },
];

//función para que segun el texto devuelva la mejor respuesta
export function getBotResponse(input: string): string {
    const text = procesarTexto(input);

    if(!text){
        return "Escribe tu duda para ayudarte";
    }
    
    //buscar la primera regla que coincida
    const regla = reglas.find((r) => 
    r.patrones.some((p) => p.test(text))
    );
    if(!regla){
        return(
        "Por el momento no puedo ayudarte.\n" +
        "Puedes preguntar sobre registro, publicación de servicios, búsqueda de prestadores, calificaciones o seguridad."
        ); 
    }

    if(typeof regla.respuesta === "function"){
        return regla.respuesta(text);
    }
   return regla.respuesta;
}