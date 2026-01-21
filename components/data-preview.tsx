"use client";

import type { ColumnSettings } from "./column-config";
import { CENTERED_COLUMNS } from "./../lib/defaults";
import { ConditionalRule } from "@/types";
import { t } from "@/lib/i18n";

interface DataPreviewProps {
  data: Record<string, unknown>[];
  columns: ColumnSettings[];
  rules: ConditionalRule[]; // Recibimos las reglas aquí
}

export function DataPreview({ data, columns, rules }: DataPreviewProps) {
  const visibleColumns = columns.filter((col) => col.visible);
  const limitData = 20;
  const previewData = data.slice(0, limitData);

  if (visibleColumns.length === 0) {
    return (
      <div className="border-2 border-accent rounded-md p-8 text-center">
        <p className="text-muted-foreground">{t("preview.noCol")}</p>
      </div>
    );
  }

  return (
    <div className="border-2 border-accent rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              {visibleColumns.map((col) => {
                const isCentered = CENTERED_COLUMNS.includes(col.originalName);
                return (
                  <th
                    key={col.id}
                    className={`px-4 py-3 font-semibold uppercase tracking-wide text-xs whitespace-nowrap border-x border-accent/20 ${
                      isCentered ? "text-center" : "text-left"
                    }`}
                    style={{
                      backgroundColor: col.headerColor,
                      color: col.textColor,
                    }}
                  >
                    {col.displayName}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {previewData.map((row, rowIndex) => {
              // 1. Lógica para determinar si la FILA completa debe tener color
              let rowBgColor = "";
              rules.forEach((rule) => {
                const cellValue = String(row[rule.field] || "")
                  .trim()
                  .toLowerCase();
                const targetValue = rule.value.trim().toLowerCase();
                if (
                  targetValue !== "" &&
                  cellValue === targetValue &&
                  rule.target === "row"
                ) {
                  rowBgColor = rule.color;
                }
              });

              return (
                <tr
                  key={rowIndex}
                  className="border-t border-accent transition-colors hover:bg-muted/30"
                  style={{
                    backgroundColor: rowBgColor ? `${rowBgColor}44` : undefined,
                  }}
                  // Usamos "44" al final del hex para dar 25% de opacidad y que sea legible en web
                >
                  {visibleColumns.map((col) => {
                    const isCentered = CENTERED_COLUMNS.includes(
                      col.originalName,
                    );

                    // 2. Lógica para determinar si esta CELDA específica debe tener color
                    let cellBgColor = "";
                    rules.forEach((rule) => {
                      const cellValue = String(row[rule.field] || "")
                        .trim()
                        .toLowerCase();
                      const targetValue = rule.value.trim().toLowerCase();
                      if (
                        targetValue !== "" &&
                        cellValue === targetValue &&
                        rule.target === "cell" &&
                        col.originalName === rule.field
                      ) {
                        cellBgColor = rule.color;
                      }
                    });

                    return (
                      <td
                        key={col.id}
                        className={`px-4 py-3 whitespace-nowrap border-x border-accent/10 ${
                          isCentered ? "text-center" : "text-left"
                        }`}
                        style={{
                          backgroundColor: cellBgColor || undefined,
                          color: col.textColor,
                        }}
                      >
                        {String(row[col.originalName] ?? "")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {data.length > limitData && (
        <div className="px-4 py-2 bg-muted text-center text-xs text-muted-foreground border-t border-accent">
          {t("preview.preview1")} {limitData} {t("preview.preview2")}{" "}
          {data.length} {t("preview.preview3")}
        </div>
      )}
    </div>
  );
}
