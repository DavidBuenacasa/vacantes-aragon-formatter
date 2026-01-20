"use client";

import React, { useState } from "react";
import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ColumnConfig, type ColumnSettings } from "@/components/column-config";
import { t } from "@/lib/i18n";

interface ConfigureOrderProps {
  columns: ColumnSettings[];
  onColumnsChange: (columns: ColumnSettings[]) => void;
}

export const ConfigureOrder = ({
  columns,
  onColumnsChange,
}: ConfigureOrderProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // --- Lógica de Drag & Drop Interna ---
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

    // Actualizamos el orden numérico de cada columna
    const updatedColumns = newColumns.map((col, i) => ({ ...col, order: i }));
    onColumnsChange(updatedColumns);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <section className="mb-8">
      <h2 className="text-sm font-bold uppercase tracking-wide text-foreground mb-4 flex items-center gap-2">
        <span className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs">
          {t("configureOrder.idSection")}
        </span>
        {t("configureOrder.title")}
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        {t("configureOrder.description")}
      </p>
      <Card className="border-2 border-accent shadow-sm">
        <CardHeader className="border-b-2 border-accent bg-accent/5 py-4">
          <CardTitle className="text-sm font-bold uppercase tracking-wide flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" />
            {t("configureOrder.subtitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 max-h-125 overflow-y-auto">
          <ColumnConfig
            columns={columns}
            onColumnsChange={onColumnsChange}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            draggedIndex={draggedIndex}
          />
        </CardContent>
      </Card>
    </section>
  );
};