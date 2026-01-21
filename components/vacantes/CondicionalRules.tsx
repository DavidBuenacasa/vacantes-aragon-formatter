"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ColumnSettings } from "@/components/column-config";
import { ConditionalRule } from "@/types";
import { t } from "@/lib/i18n";

interface ConditionalRulesProps {
  rules: ConditionalRule[];
  columns: ColumnSettings[];
  onRulesChange: (rules: ConditionalRule[]) => void;
}

export const ConditionalRules = ({
  rules,
  columns,
  onRulesChange,
}: ConditionalRulesProps) => {
  const addRule = () => {
    const newRule: ConditionalRule = {
      id: crypto.randomUUID(),
      field: columns[0]?.originalName || "",
      value: "",
      color: "#fef3e2",
      target: "row",
    };
    onRulesChange([...rules, newRule]);
  };

  const updateRule = (id: string, updates: Partial<ConditionalRule>) => {
    onRulesChange(rules.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const removeRule = (id: string) => {
    onRulesChange(rules.filter((r) => r.id !== id));
  };

  return (
    <section className="mb-8">
      <h2 className="text-sm font-bold uppercase tracking-wide text-foreground mb-4 flex items-center gap-2">
        <span className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs">
          {t("condicionalRules.idSection")}
        </span>
        {t("condicionalRules.title")}
      </h2>
      <Card className="border-2 border-accent">
        <CardContent className="p-6">
          <div className="space-y-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="flex flex-wrap items-center gap-3 p-3 bg-muted rounded-lg transition-all border border-transparent hover:border-accent/50"
              >
                <span className="text-sm font-medium">
                  {t("condicionalRules.conditional")}
                </span>

                <select
                  className="bg-background border rounded h-9 px-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                  value={rule.field}
                  onChange={(e) =>
                    updateRule(rule.id, { field: e.target.value })
                  }
                >
                  {columns.map((c) => (
                    <option key={c.id} value={c.originalName}>
                      {c.displayName}
                    </option>
                  ))}
                </select>

                <span className="text-sm font-medium">
                  {t("condicionalRules.condition")}
                </span>

                <input
                  className="bg-background border rounded h-9 px-3 text-sm flex-1 min-w-37.5 focus:ring-2 focus:ring-primary outline-none"
                  placeholder={t("condicionalRules.example")}
                  value={rule.value}
                  onChange={(e) =>
                    updateRule(rule.id, { value: e.target.value })
                  }
                />

                <span className="text-sm font-medium">
                  {t("condicionalRules.action")}
                </span>

                <div className="flex items-center gap-2 bg-background border rounded h-9 px-2">
                  <select
                    className="bg-transparent text-sm outline-none cursor-pointer"
                    value={rule.target}
                    onChange={(e) =>
                      updateRule(rule.id, { target: e.target.value as any })
                    }
                  >
                    <option value="row">
                      {t("condicionalRules.targetRow")}
                    </option>
                    <option value="cell">
                      {t("condicionalRules.targetCell")}
                    </option>
                  </select>
                  <div className="w-px h-4 bg-border mx-1" />
                  <input
                    type="color"
                    value={rule.color}
                    onChange={(e) =>
                      updateRule(rule.id, { color: e.target.value })
                    }
                    className="w-6 h-6 rounded-sm cursor-pointer border-none p-0 bg-transparent"
                  />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRule(rule.id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            <Button
              variant="outline"
              onClick={addRule}
              className="w-full sm:w-auto border-dashed border-2 hover:border-primary transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("condicionalRules.addButton")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
