export type QuickReply = {
  id: string;
  label: string;
  value: string;
};

export type BotReply = {
  text: string;
  suggestions?: QuickReply[];
};

export type BotMessage = {
  from: "user" | "bot";
  text: string;
  suggestions?: QuickReply[];
};

// funciones funcionales
const limpiar = (t: string) => t.trim();
const normalizar = (t: string) => t.toLowerCase();
const sinAcentos = (t: string) =>
  t.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const compactar = (t: string) => t.replace(/\s+/g, " ");

const procesar = (txt: string) =>
  compactar(sinAcentos(normalizar(limpiar(txt))));

const tokenizar = (txt: string) =>
  txt.split(" ").filter((t) => t.length > 0);

// Tipos de intención
export type IntentId =
  | "saludo"
  | "informacion_general"
  | "modificar_datos"
  | "cambiar_contraseña"
  | "recuperar_contraseña"
  | "problema_acceso"
  | "crear_cuenta"
  | "buscar_servicio"
  | "publicacion"
  | "problema_publicacion"
  | "problema_ubicacion"
  | "despedida"
  | "agradecimiento"
  | "desambiguar"
  | "desconocido";

type IntentContext = {
  raw: string;
  norm: string;
  tokens: string[];
};

type IntentScore = {
  id: IntentId;
  score: number;
};

// Sinónimos
const sinonimos: Record<string, string[]> = {
  contrasena: ["contraseña", "contrasena", "password", "pass", "clave"],
  correo: ["correo", "email", "mail"],
  perfil: ["perfil", "datos", "cuenta", "informacion"],
  foto: ["foto", "imagen", "avatar"],
  publicacion: ["publicacion", "publicación", "post", "anuncio"],
};

const conceptosIntencion: Record<IntentId, string[]> = {
  saludo: ["hola", "buenas", "hey", "ola"],
  informacion_general: ["ayuda", "que eres", "que puedes hacer", "funcionas"],

  modificar_datos: [
    "editar",
    "modificar datos",
    "cambiar datos",
    "actualizar datos",
    "corregir",
    "ajustar",
    "mis datos",
    "perfil",
  ],

  cambiar_contraseña: [
    "cambiar contrasena",
    "modificar contrasena",
    "actualizar contrasena",
    "contrasena",
    "password",
  ],

  recuperar_contraseña: [
    "restablecer ",
    "recuperar",
    "olvide",
    "no recuerdo",
  ],

  problema_acceso: [
    "no puedo entrar",
    "no inicia",
    "no puedo iniciar",
    "no funciona el login",
    "problema acceso",
    "no me deja entrar",
  ],

  crear_cuenta: ["crear cuenta", "registro", "registrarme"],

  buscar_servicio: ["buscar", "encontrar", "servicio cerca", "necesito"],

  publicacion: ["publicar", "subir trabajo", "subir servicio", "mis publicaciones"],

  problema_publicacion: [
    "no puedo publicar",
    "error publicacion",
    "no sube imagen",
    "no aparecen mis publicaciones",
  ],

  despedida: ["adios", "adiós", "nos vemos", "hasta pronto", "hasta luego", "bye"],

  agradecimiento: ["gracias", "muchas gracias", "te lo agradezco", "muy amable"],

  desambiguar: [],
  desconocido: [],
};

// Memoria 
type MemoryItem = {
  userText: string;
  intent: IntentId;
  entity: string | null;
  timestamp: number;
};

const MEMORIA_MAX = 5;
const memoria: MemoryItem[] = [];

function recordarInteraccion(item: MemoryItem) {
  memoria.push(item);
  if (memoria.length > MEMORIA_MAX) memoria.shift();
}

function obtenerUltimaInteraccion(): MemoryItem | null {
  return memoria.length ? memoria[memoria.length - 1] : null;
}

// Aprendizaje ligero
export const frasesAprendidas: Record<string, string[]> = {};

export function aprenderFrase(intent: IntentId, frase: string) {
  if (!frasesAprendidas[intent]) {
    frasesAprendidas[intent] = [];
  }
  frasesAprendidas[intent].push(frase.toLowerCase());
}

// Detección de entidad
function detectarEntidad(ctx: IntentContext): string | null {
  for (const concepto in sinonimos) {
    if (sinonimos[concepto].some((pal) => ctx.norm.includes(pal))) {
      return concepto;
    }
  }
  return null;
}

// Puntuación de intención
function puntuarIntencion(ctx: IntentContext): IntentScore[] {
  const resultados: IntentScore[] = [];

  for (const key in conceptosIntencion) {
    const id = key as IntentId;
    const frases = conceptosIntencion[id];

    let score = 0;

    frases.forEach((fr) => {
      if (ctx.norm.includes(fr)) score += 3;
      fr.split(" ").forEach((t) => {
        if (ctx.tokens.includes(t)) score += 1;
      });
    });

    // Aplicar aprendizaje
    if (frasesAprendidas[id]) {
      frasesAprendidas[id].forEach((fr) => {
        if (ctx.norm.includes(fr)) score += 4;
      });
    }

    const entidad = detectarEntidad(ctx);
    if (id === "cambiar_contraseña" && entidad === "contrasena") score += 2;

    const ultima = obtenerUltimaInteraccion();
    if (ultima && ultima.intent === id) score += 1;

    resultados.push({ id, score });
  }

  return resultados.sort((a, b) => b.score - a.score);
}

//  Desambiguación
function desambiguarIntent(empatados: IntentScore[]): IntentId | "desambiguar" {
  if (empatados.length <= 1) return empatados[0].id;
  return "desambiguar";
}

function resolverIntencion(
  ctx: IntentContext
): { intent: IntentId; entity: string | null; candidatos?: IntentScore[] } {
  const scores = puntuarIntencion(ctx);
  const top = scores[0];

  if (top.score === 0) {
    return { intent: "desconocido", entity: detectarEntidad(ctx) };
  }

  const empatados = scores.filter((s) => s.score === top.score);
  const decision = desambiguarIntent(empatados);

  if (decision === "desambiguar") {
    return { intent: "desambiguar", entity: null, candidatos: empatados };
  }

  return { intent: decision, entity: detectarEntidad(ctx) };
}


//Respuestas por intención
function generarRespuesta(intent: IntentId, entidad: string | null): string {
  if (intent === "saludo") return "¡Hola! ¿En qué puedo ayudarte? 😊";

  if (intent === "agradecimiento")
    return "¡Con gusto! ¿Necesitas algo más? 😊";

  if (intent === "despedida")
    return "¡Gracias por usar OficioYa! Que tengas un excelente día 👋";

  if (intent === "informacion_general")
    return "Puedo ayudarte con registro, publicaciones, servicios y problemas comunes.";

  if (intent === "crear_cuenta")
    return "Para crear una cuenta, selecciona 'Registrarme' desde la pantalla principal.";

  if (intent === "buscar_servicio")
    return "Puedes buscar prestadores desde la opción 'Buscar'. Ingresa el nombre del servicio a buscar, puedes filtrar por ciudad.";

  if (intent === "publicacion")
    return "Puedes crear publicaciones desde tu perfil, en la sección 'Mis publicaciones', pulsa en la opción nueva, selecciona un imagen, de manera opcional agrega una descripción y publica ";

  if (intent === "modificar_datos")
    return "Para modificar tus datos, entra a tu perfil y selecciona 'Modificar mis datos'. Podras modificar tu correo, telefono, ciudad y foto de perfil.";

  if (intent === "cambiar_contraseña")
    return "Puedes cambiar tu contraseña desde tu perfil, en la opción 'Cambiar contraseña'. Donde debes ingresar tu contraseña actual y tu nueva contraseña.";

  if(intent === "recuperar_contraseña")
    return "Puedes recuperar tu contraseña desde el login, ingresando en la opción 'Olvidé mi contraseña'. Donde tendras que colocar tu dirección de correo para reestablecer tu contraseña."

  if (intent === "problema_acceso")
    return "Si no puedes iniciar sesión, revisa tu correo y contraseña o usa 'Olvidé mi contraseña' para reestablecer tu contraseña.";

  if (intent === "problema_publicacion")
    return "Si no puedes publicar, revisa tu conexión y permisos para la galería.";

  return "No entendí muy bien tu consulta. ¿Puedes darme más detalles?";
}

//  Motor principal
export function getBotResponse(input: string): BotReply {
  const norm = procesar(input);
  const tokens = tokenizar(norm);

  const ctx: IntentContext = { raw: input, norm, tokens };

  const { intent, entity, candidatos } = resolverIntencion(ctx);

  // Desambiguación
  if (intent === "desambiguar" && candidatos) {
    return {
      text: "¿A qué te refieres exactamente?",
      suggestions: candidatos.map((c, i) => ({
        id: "opt_" + i,
        label: c.id.replace("_", " "),
        value: c.id.replace("_", " "),
      })),
    };
  }

  // Guardar en memoria
  recordarInteraccion({
    userText: input,
    intent,
    entity,
    timestamp: Date.now(),
  });

  return {
    text: generarRespuesta(intent, entity),
    suggestions: [],
  };
}
