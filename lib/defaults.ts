import { ConditionalRule, SortConfig } from "@/types";

// Reglas condicionales por defecto:
export const DEFAULT_RULES: ConditionalRule[] = [
  {
    id: "default-1",
    field: "PROVINCIA CENTRO",
    value: "Zaragoza",
    color: "#FFC8C8",
    target: "row",
  },
  {
    id: "default-2",
    field: "PROVINCIA CENTRO",
    value: "Huesca",
    color: "#C8FFC8",
    target: "row",
  },
  {
    id: "default-3",
    field: "PROVINCIA CENTRO",
    value: "Teruel",
    color: "#C8C8FF",
    target: "row",
  },
  {
    id: "default-4",
    field: "JORNADA",
    value: "Parcial",
    color: "#E3B2B2",
    target: "cell",
  },
  {
    id: "default-5",
    field: "JORNADA",
    value: "Completa",
    color: "#4BC4E1",
    target: "cell",
  },
  {
    id: "default-6",
    field: "OBLIGATORIEDAD",
    value: "Voluntaria",
    color: "#00FF00",
    target: "cell",
  },
  {
    id: "default-7",
    field: "OBLIGATORIEDAD",
    value: "Obligatoria",
    color: "#FF7028",
    target: "cell",
  },
  {
    id: "default-8",
    field: "ITINERANTE",
    value: "Si",
    color: "#FFFF00",
    target: "cell",
  },
  {
    id: "default-9",
    field: "ITINERANTE",
    value: "No",
    color: "#FF4028",
    target: "cell",
  },
];

export const DEFAULT_SORT: SortConfig[] = [
  {
    id: "sort-1",
    field: "ESPECIALIDAD", // Ajustar al nombre exacto de la columna del Excel
    direction: "asc",
  },
  {
    id: "sort-2",
    field: "PROVINCIA CENTRO",
    direction: "asc",
  },
  {
    id: "sort-3",
    field: "JORNADA",
    direction: "asc",
  },
  {
    id: "sort-4",
    field: "OBLIGATORIEDAD",
    direction: "asc",
  },
  {
    id: "sort-5",
    field: "LOCALIDAD",
    direction: "asc",
  },
];

export const DEFAULT_COLORS = {
  header: "#f97316",
  cell: "#fef3e2",
  text: "#1e1b4b",
};

export const CENTERED_COLUMNS = [
  "ID",
  "CUERPO",
  "COD. CENTRO",
  "PROVINCIA CENTRO",
  "FECHA ORIGEN",
  "DURACION",
  "FECHA FINAL",
  "LARGA DURACIÓN",
  "JORNADA",
  "HORAS LECTIVAS",
  "PORCENTAJE HORAS",
  "COMPLETAR HORARIO",
  "OBLIGATORIEDAD",
  "COMPARTIDA",
  "COMP. OTRA LOCALIDAD",
  "ITINERANTE",
  "PERFILADA",
];

export const COLUMNS_TO_HIDE = ["IdVacante", "Hash"];
