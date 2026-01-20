import es from "../locales/es.json";

// Tipo para autocompletado (opcional pero recomendado)
type TranslationKeys = typeof es;

export function t(path: string, replacements?: Record<string, string | number>): string {
  const keys = path.split(".");
  let result: any = es;

  for (const key of keys) {
    if (result[key] === undefined) return path; // Si no existe, devuelve la ruta
    result = result[key];
  }

  if (replacements) {
    let finalString = result as string;
    Object.entries(replacements).forEach(([key, value]) => {
      finalString = finalString.replace(`{{${key}}}`, String(value));
    });
    return finalString;
  }

  return result;
}