"use client";

import React, { useMemo } from "react";
import { Table } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataPreview } from "@/components/data-preview";
import { ColumnSettings } from "@/components/column-config";
import { SortConfig } from "@/types";

interface PreviewProps {
  data: Record<string, unknown>[];
  columns: ColumnSettings[];
  sortRules: SortConfig[];
}

export const Preview = ({ data, columns, sortRules }: PreviewProps) => {
  // Memorizamos los datos ordenados para evitar cálculos innecesarios en cada render
  const sortedData = useMemo(() => {
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
  }, [data, sortRules]);

  return (
    <section className="mb-8">
      <h2 className="text-sm font-bold uppercase tracking-wide text-foreground mb-4 flex items-center gap-2">
        <span className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs">
          3
        </span>
        Vista previa
      </h2>
      <Card className="border-2 border-accent shadow-sm">
        <CardHeader className="border-b-2 border-accent bg-accent/5 py-4">
          <CardTitle className="text-sm font-bold uppercase tracking-wide flex items-center gap-2">
            <Table className="w-4 h-4 text-primary" />
            Vista previa del resultado
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-md border overflow-hidden">
            <DataPreview data={sortedData} columns={columns} />
          </div>
          <p className="text-[11px] text-muted-foreground mt-3 italic">
            * Mostrando una previsualización de los datos con el orden y formato aplicados.
          </p>
        </CardContent>
      </Card>
    </section>
  );
};