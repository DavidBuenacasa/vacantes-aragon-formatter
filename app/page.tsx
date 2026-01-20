"use client";

import React from "react";

import { useState, useCallback } from "react";
import XLSX from "xlsx-js-style";
import { Download, FileSpreadsheet, Settings, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/file-upload";
import { ColumnConfig, type ColumnSettings } from "@/components/column-config";
import { DataPreview } from "@/components/data-preview";

const DEFAULT_COLORS = {
  header: "#f97316",
  cell: "#fef3e2",
  text: "#1e1b4b",
};

export default function VacantesAragonFormatter() {
  const [excelData, setExcelData] = useState<Record<string, unknown>[]>([]);
  const [columns, setColumns] = useState<ColumnSettings[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  type ConditionalRule = {
    id: string;
    field: string;
    value: string;
    color: string;
    target: "row" | "cell"; // ¿Colorear toda la fila o solo la celda?
  };

  type SortConfig = {
    id: string;
    field: string;
    direction: "asc" | "desc";
  };

  // Reglas condicionales por defecto:
  const DEFAULT_RULES: ConditionalRule[] = [
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

  const DEFAULT_SORT: SortConfig[] = [
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

  const [rules, setRules] = useState<ConditionalRule[]>(DEFAULT_RULES);

  const [sortRules, setSortRules] = useState<SortConfig[]>(DEFAULT_SORT);

  // Función para ordenar los datos según las reglas establecidas
  const getSortedData = (data: Record<string, unknown>[]) => {
    if (sortRules.length === 0) return data;

    return [...data].sort((a, b) => {
      for (const rule of sortRules) {
        const valueA = a[rule.field];
        const valueB = b[rule.field];

        if (valueA === valueB) continue;

        const modifier = rule.direction === "asc" ? 1 : -1;

        // Manejo de números y strings
        if (typeof valueA === "number" && typeof valueB === "number") {
          return (valueA - valueB) * modifier;
        }

        return String(valueA).localeCompare(String(valueB)) * modifier;
      }
      return 0;
    });
  };

  const handleFileSelect = useCallback(async (file: File) => {
    setIsProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(firstSheet) as Record<
        string,
        unknown
      >[];

      if (data.length > 0) {
        const headers = Object.keys(data[0]);
        const newColumns: ColumnSettings[] = headers.map((header, index) => ({
          id: `col-${index}`,
          originalName: header,
          displayName: header,
          visible: true,
          headerColor: DEFAULT_COLORS.header,
          cellColor: DEFAULT_COLORS.cell,
          textColor: DEFAULT_COLORS.text,
          order: index,
        }));
        setColumns(newColumns);

        if (data.length > 0) {
          const headers = Object.keys(data[0]);
          // Filtramos las reglas por defecto para que solo se mantengan las que existen en este Excel
          const activeRules = DEFAULT_RULES.filter((rule) =>
            headers.includes(rule.field),
          );
          setRules(activeRules);
        }

        setExcelData(data);

        // Solo mantener reglas por defecto si las columnas existen en el nuevo archivo
        const validDefaultSort = DEFAULT_SORT.filter((sort) =>
          headers.includes(sort.field),
        );

        if (validDefaultSort.length > 0) {
          setSortRules(validDefaultSort);
        }
      }
    } catch (error) {
      console.error("Error reading file:", error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newColumns = [...columns];
    const draggedColumn = newColumns[draggedIndex];
    newColumns.splice(draggedIndex, 1);
    newColumns.splice(index, 0, draggedColumn);

    setColumns(newColumns.map((col, i) => ({ ...col, order: i })));
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

const exportFormattedExcel = () => {
  const visibleColumns = columns.filter((col) => col.visible);
  const sortedData = getSortedData(excelData);

  const formattedData = sortedData.map((row) => {
    const newRow: Record<string, unknown> = {};
    visibleColumns.forEach((col) => {
      newRow[col.displayName] = row[col.originalName];
    });
    return newRow;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");

  // --- 1. AJUSTE DE ANCHO AUTOMÁTICO ---
  const colWidths = visibleColumns.map((col, i) => {
    // Empezamos con el ancho del nombre de la columna
    let maxWidth = col.displayName.length;
    
    // Comparamos con el contenido de cada fila en esa columna
    sortedData.forEach((row) => {
      const value = String(row[col.originalName] || "");
      if (value.length > maxWidth) maxWidth = value.length;
    });
    
    // Añadimos un pequeño margen (padding)
    return { wch: maxWidth + 2 };
  });
  worksheet["!cols"] = colWidths;

  // --- 2. BORDES Y ESTILOS ---
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
      if (!worksheet[cellRef]) continue;

      const isHeader = R === 0;
      const colConfig = visibleColumns[C];
      const rowData = sortedData[R - 1];

      // Definición de bordes
      const borderStyle = {
        top: { style: R === range.s.r ? "medium" : "thin" },
        bottom: { style: R === range.e.r ? "medium" : "thin" },
        left: { style: C === range.s.c ? "medium" : "thin" },
        right: { style: C === range.e.c ? "medium" : "thin" },
      };

      let bgColor = "#FFFFFF";
      let textColor = "000000";

      if (isHeader) {
        bgColor = colConfig.headerColor;
        textColor = colConfig.textColor.replace("#", "");
      } else {
        // Aplicar tus reglas de resaltado...
        rules.forEach((rule) => {
          const valorCelda = String(rowData[rule.field] || "").trim().toLowerCase();
          const valorBuscado = rule.value.trim().toLowerCase();
          if (valorBuscado !== "" && valorCelda === valorBuscado) {
            if (rule.target === "row") bgColor = rule.color;
            else if (rule.target === "cell" && colConfig.originalName === rule.field) bgColor = rule.color;
          }
        });
      }

      worksheet[cellRef].s = {
        fill: { fgColor: { rgb: bgColor.replace("#", "") } },
        font: { 
          bold: isHeader, 
          color: { rgb: textColor },
          name: "Arial",
          sz: 10
        },
        alignment: { 
          horizontal: isHeader ? "center" : "left",
          vertical: "center"
        },
        border: borderStyle // <--- APLICACIÓN DE BORDES
      };
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Resultado");
  XLSX.writeFile(workbook, "vacantes_formateadas.xlsx");
};

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-accent bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-primary flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground uppercase tracking-wide">
                Vacantes Aragón Formatter
              </h1>
              <p className="text-sm text-muted-foreground">
                Formatea tu Excel de vacantes educativas
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Step 1: Upload */}
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wide text-foreground mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs">
              1
            </span>
            Subir archivo
          </h2>
          <Card className="border-2 border-accent">
            <CardContent className="p-6">
              <FileUpload onFileSelect={handleFileSelect} />
              {isProcessing && (
                <p className="text-sm text-muted-foreground mt-3 text-center">
                  Procesando archivo...
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        {columns.length > 0 && (
          <>
            {/* Step 2.5: Reglas Condicionales */}
            <section className="mb-8">
              <h2 className="text-sm font-bold uppercase tracking-wide text-foreground mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs">
                  2.5
                </span>
                Reglas de resaltado
              </h2>
              <Card className="border-2 border-accent">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {rules.map((rule) => (
                      <div
                        key={rule.id}
                        className="flex flex-wrap items-center gap-3 p-3 bg-muted rounded-lg"
                      >
                        <span className="text-sm font-medium">Si</span>
                        <select
                          className="bg-background border rounded p-1 text-sm"
                          value={rule.field}
                          onChange={(e) =>
                            setRules(
                              rules.map((r) =>
                                r.id === rule.id
                                  ? { ...r, field: e.target.value }
                                  : r,
                              ),
                            )
                          }
                        >
                          {columns.map((c) => (
                            <option key={c.id} value={c.originalName}>
                              {c.displayName}
                            </option>
                          ))}
                        </select>
                        <span className="text-sm font-medium">es</span>
                        <input
                          className="bg-background border rounded p-1 text-sm"
                          placeholder="Ej: Zaragoza"
                          value={rule.value}
                          onChange={(e) =>
                            setRules(
                              rules.map((r) =>
                                r.id === rule.id
                                  ? { ...r, value: e.target.value }
                                  : r,
                              ),
                            )
                          }
                        />
                        <span className="text-sm font-medium">pintar</span>
                        <select
                          className="bg-background border rounded p-1 text-sm"
                          value={rule.target}
                          onChange={(e) =>
                            setRules(
                              rules.map((r) =>
                                r.id === rule.id
                                  ? { ...r, target: e.target.value as any }
                                  : r,
                              ),
                            )
                          }
                        >
                          <option value="row">Fila completa</option>
                          <option value="cell">Solo celda</option>
                        </select>
                        <input
                          type="color"
                          value={rule.color}
                          onChange={(e) =>
                            setRules(
                              rules.map((r) =>
                                r.id === rule.id
                                  ? { ...r, color: e.target.value }
                                  : r,
                              ),
                            )
                          }
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setRules(rules.filter((r) => r.id !== rule.id))
                          }
                          className="text-destructive"
                        >
                          Eliminar
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() =>
                        setRules([
                          ...rules,
                          {
                            id: Math.random().toString(),
                            field: columns[0]?.originalName,
                            value: "",
                            color: "#fef3e2",
                            target: "row",
                          },
                        ])
                      }
                    >
                      + Añadir regla (Ej: Zaragoza o Jornada Completa)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Step 2.7: Ordenación */}
            <section className="mb-8">
              <h2 className="text-sm font-bold uppercase tracking-wide text-foreground mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs">
                  2.7
                </span>
                Prioridad de Ordenación
              </h2>
              <Card className="border-2 border-accent">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {sortRules.map((rule, index) => (
                      <div
                        key={rule.id}
                        className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                      >
                        <span className="text-xs font-bold text-muted-foreground w-6">
                          {index + 1}º
                        </span>
                        <select
                          className="bg-background border rounded p-1 text-sm flex-1"
                          value={rule.field}
                          onChange={(e) =>
                            setSortRules(
                              sortRules.map((r) =>
                                r.id === rule.id
                                  ? { ...r, field: e.target.value }
                                  : r,
                              ),
                            )
                          }
                        >
                          {columns.map((c) => (
                            <option key={c.id} value={c.originalName}>
                              {c.displayName}
                            </option>
                          ))}
                        </select>
                        <select
                          className="bg-background border rounded p-1 text-sm"
                          value={rule.direction}
                          onChange={(e) =>
                            setSortRules(
                              sortRules.map((r) =>
                                r.id === rule.id
                                  ? {
                                      ...r,
                                      direction: e.target.value as
                                        | "asc"
                                        | "desc",
                                    }
                                  : r,
                              ),
                            )
                          }
                        >
                          <option value="asc">Ascendente (A-Z)</option>
                          <option value="desc">Descendente (Z-A)</option>
                        </select>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setSortRules(
                              sortRules.filter((r) => r.id !== rule.id),
                            )
                          }
                          className="text-destructive"
                        >
                          Eliminar
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setSortRules([
                          ...sortRules,
                          {
                            id: Math.random().toString(),
                            field: columns[0].originalName,
                            direction: "asc",
                          },
                        ])
                      }
                    >
                      + Añadir nivel de orden (Ej: 1º Provincia, 2º Localidad)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Step 2: Configure */}
            <section className="mb-8">
              <h2 className="text-sm font-bold uppercase tracking-wide text-foreground mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs">
                  2
                </span>
                Configurar columnas
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Arrastra las columnas para reordenarlas. Configura colores y
                nombres para cada una.
              </p>
              <Card className="border-2 border-accent">
                <CardHeader className="border-b-2 border-accent">
                  <CardTitle className="text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Configuración de columnas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 max-h-125 overflow-y-auto">
                  <ColumnConfig
                    columns={columns}
                    onColumnsChange={setColumns}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    draggedIndex={draggedIndex}
                  />
                </CardContent>
              </Card>
            </section>

            {/* Step 2.5: Reglas Condicionales */}

            {/* Step 3: Preview */}
            <section className="mb-8">
              <h2 className="text-sm font-bold uppercase tracking-wide text-foreground mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs">
                  3
                </span>
                Vista previa
              </h2>
              <Card className="border-2 border-accent">
                <CardHeader className="border-b-2 border-accent">
                  <CardTitle className="text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                    <Table className="w-4 h-4" />
                    Vista previa del resultado
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <DataPreview data={getSortedData(excelData)} columns={columns} />                </CardContent>
              </Card>
            </section>

            {/* Step 4: Export */}
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wide text-foreground mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs">
                  4
                </span>
                Descargar
              </h2>
              <Card className="border-2 border-accent">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-foreground">
                        Tu archivo está listo
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {excelData.length} filas ·{" "}
                        {columns.filter((c) => c.visible).length} columnas
                        visibles
                      </p>
                    </div>
                    <Button
                      onClick={exportFormattedExcel}
                      size="lg"
                      className="gap-2 uppercase tracking-wide font-semibold"
                    >
                      <Download className="w-4 h-4" />
                      Descargar Excel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
