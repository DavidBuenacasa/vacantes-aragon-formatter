import XLSX from "xlsx-js-style";
import { ColumnSettings } from "@/components/column-config";
import { ConditionalRule, SortConfig } from "@/types";

// Función centralizada de ordenación
export const sortData = (data: any[], sortRules: SortConfig[]) => {
  if (sortRules.length === 0) return data;

  return [...data].sort((a, b) => {
    for (const rule of sortRules) {
      const valueA = a[rule.field];
      const valueB = b[rule.field];

      if (valueA === valueB) continue;

      const modifier = rule.direction === "asc" ? 1 : -1;

      if (typeof valueA === "number" && typeof valueB === "number") {
        return (valueA - valueB) * modifier;
      }

      return (
        String(valueA).localeCompare(String(valueB), "es", {
          sensitivity: "base",
        }) * modifier
      );
    }
    return 0;
  });
};

export const generateExcel = (
  data: any[],
  columns: ColumnSettings[],
  rules: ConditionalRule[],
  sortRules: SortConfig[],
) => {
  const sortedData = sortData(data, sortRules);
  const visibleColumns = columns.filter((col) => col.visible);

  // 1. Mapear datos a los nombres visuales
  const formattedData = sortedData.map((row) => {
    const newRow: Record<string, unknown> = {};
    visibleColumns.forEach((col) => {
      newRow[col.displayName] = row[col.originalName];
    });
    return newRow;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");

  // 2. Ajuste de ancho automático
  worksheet["!cols"] = visibleColumns.map((col) => {
    let maxWidth = col.displayName.length;
    sortedData.forEach((row) => {
      const value = String(row[col.originalName] || "");
      if (value.length > maxWidth) maxWidth = value.length;
    });
    return { wch: maxWidth + 4 }; // Margen de seguridad
  });

  // 3. Aplicación de Estilos y Reglas
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
      if (!worksheet[cellRef]) continue;

      const isHeader = R === 0;
      const colConfig = visibleColumns[C];
      const rowData = sortedData[R - 1];

      let bgColor = "#FFFFFF";
      let textColor = "000000";

      if (isHeader) {
        bgColor = colConfig.headerColor;
        textColor = colConfig.textColor.replace("#", "");
      } else {
        rules.forEach((rule) => {
          const valorCelda = String(rowData[rule.field] || "")
            .trim()
            .toLowerCase();
          const valorBuscado = rule.value.trim().toLowerCase();
          if (valorBuscado !== "" && valorCelda === valorBuscado) {
            if (rule.target === "row") bgColor = rule.color;
            else if (
              rule.target === "cell" &&
              colConfig.originalName === rule.field
            )
              bgColor = rule.color;
          }
        });
      }

      worksheet[cellRef].s = {
        fill: { fgColor: { rgb: bgColor.replace("#", "") } },
        font: {
          bold: isHeader,
          color: { rgb: textColor },
          name: "Arial",
          sz: 10,
        },
        alignment: {
          horizontal: isHeader ? "center" : "left",
          vertical: "center",
        },
        border: {
          top: { style: R === range.s.r ? "medium" : "thin" },
          bottom: { style: R === range.e.r ? "medium" : "thin" },
          left: { style: C === range.s.c ? "medium" : "thin" },
          right: { style: C === range.e.c ? "medium" : "thin" },
        },
      };
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Resultado");
  XLSX.writeFile(workbook, "vacantes_formateadas.xlsx");
};
