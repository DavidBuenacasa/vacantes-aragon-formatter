import { useCallback, useState } from "react";
import XLSX from "xlsx-js-style";
import { ColumnSettings } from "../column-config";
import { FileUpload } from "../file-upload";
import { Card, CardContent } from "../ui/card";
import {
  DEFAULT_RULES,
  DEFAULT_SORT,
  DEFAULT_COLORS,
  COLUMNS_TO_HIDE,
  COLUMNS_TO_CENTER,
} from "@/lib/defaults";
import { ConditionalRule, SortConfig } from "@/types";

// Esta interfaz define qué "recibe" el componente
interface UploadFileProps {
  // Definimos qué le vamos a devolver al padre
  onDataLoaded: (
    data: any[],
    cols: ColumnSettings[],
    rules: ConditionalRule[],
    sort: SortConfig[],
  ) => void;
}

export function UploadFile({ onDataLoaded }: UploadFileProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = useCallback(
    async (file: File) => {
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

          // 1. Generar Columnas con lógica de Defaults
          const newColumns: ColumnSettings[] = headers.map((header, index) => ({
            id: `col-${index}`,
            originalName: header,
            displayName: header,
            visible: !COLUMNS_TO_HIDE.includes(header),
            cellColor: DEFAULT_COLORS.cell,
            align: COLUMNS_TO_CENTER.includes(header) ? "center" : "left",
            headerColor: DEFAULT_COLORS.header,
            textColor: DEFAULT_COLORS.text,
            order: index,
          }));

          // 2. Filtrar Reglas por defecto aplicables
          const activeRules = DEFAULT_RULES.filter((rule) =>
            headers.includes(rule.field),
          );

          // 3. Filtrar Ordenación por defecto aplicable
          const validDefaultSort = DEFAULT_SORT.filter((sort) =>
            headers.includes(sort.field),
          );

          // 4. ENVIAR TODO AL PADRE
          onDataLoaded(data, newColumns, activeRules, validDefaultSort);
        }
      } catch (error) {
        console.error("Error reading file:", error);
      } finally {
        setIsProcessing(false);
      }
    },
    [onDataLoaded],
  );

  return (
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
            <p className="text-sm text-muted-foreground mt-3 text-center animate-pulse">
              Procesando archivo...
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
