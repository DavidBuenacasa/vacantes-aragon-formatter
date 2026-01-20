export type ConditionalRule = {
    id: string;
    field: string;
    value: string;
    color: string;
    target: "row" | "cell"; // ¿Colorear toda la fila o solo la celda?
  };

export type SortConfig = {
    id: string;
    field: string;
    direction: "asc" | "desc";
  };