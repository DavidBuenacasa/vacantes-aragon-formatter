"use client";

import React from "react";
import { ArrowUpDown, ListOrdered, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ColumnSettings } from "@/components/column-config";
import { SortConfig } from "@/types";

interface SortRulesProps {
  sortRules: SortConfig[];
  columns: ColumnSettings[];
  onSortRulesChange: (rules: SortConfig[]) => void;
}

export const SortRules = ({
  sortRules,
  columns,
  onSortRulesChange,
}: SortRulesProps) => {
  const addSortRule = () => {
    const newRule: SortConfig = {
      id: crypto.randomUUID(),
      field: columns[0]?.originalName || "",
      direction: "asc",
    };
    onSortRulesChange([...sortRules, newRule]);
  };

  const updateSortRule = (id: string, updates: Partial<SortConfig>) => {
    onSortRulesChange(
      sortRules.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const removeSortRule = (id: string) => {
    onSortRulesChange(sortRules.filter((r) => r.id !== id));
  };

  return (
    <section className="mb-8">
      <h2 className="text-sm font-bold uppercase tracking-wide text-foreground mb-4 flex items-center gap-2">
        <span className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs">
          3
        </span>
        Prioridad de Ordenación
      </h2>
      <Card className="border-2 border-accent">
        <CardContent className="p-6">
          <div className="space-y-4">
            {sortRules.map((rule, index) => (
              <div
                key={rule.id}
                className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-transparent hover:border-accent/30 transition-all"
              >
                <div className="flex flex-col items-center justify-center bg-background rounded px-2 py-1 min-w-10 border shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground leading-none">
                    Prior.
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {index + 1}º
                  </span>
                </div>

                <select
                  className="bg-background border rounded h-9 px-2 text-sm flex-1 focus:ring-2 focus:ring-primary outline-none"
                  value={rule.field}
                  onChange={(e) => updateSortRule(rule.id, { field: e.target.value })}
                >
                  {columns.map((c) => (
                    <option key={c.id} value={c.originalName}>
                      {c.displayName}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2 bg-background border rounded h-9 px-2">
                  <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
                  <select
                    className="bg-transparent text-sm outline-none cursor-pointer"
                    value={rule.direction}
                    onChange={(e) =>
                      updateSortRule(rule.id, {
                        direction: e.target.value as "asc" | "desc",
                      })
                    }
                  >
                    <option value="asc">Ascendente (A-Z)</option>
                    <option value="desc">Descendente (Z-A)</option>
                  </select>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSortRule(rule.id)}
                  className="text-destructive hover:bg-destructive/10 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            {sortRules.length === 0 && (
              <div className="text-center py-4 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
                No hay reglas de ordenación aplicadas. Se usará el orden original.
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={addSortRule}
              className="w-full sm:w-auto border-dashed border-2 hover:border-primary transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Añadir nivel de orden (Ej: 1º Provincia, 2º Localidad)
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};