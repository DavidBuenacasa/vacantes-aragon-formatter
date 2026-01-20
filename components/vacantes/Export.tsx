"use client";

import { Download, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColumnSettings } from "@/components/column-config";
import { ConditionalRule, SortConfig } from "@/types"; // Importamos SortConfig
import { generateExcel } from "@/lib/excel-utils"
import { t } from "@/lib/i18n";

interface ExportProps {
  data: Record<string, unknown>[];
  columns: ColumnSettings[];
  rules: ConditionalRule[];
  sortRules: SortConfig[]; // <--- Nueva prop
}

export const Export = ({ data, columns, rules, sortRules }: ExportProps) => {
  const visibleColumnsCount = columns.filter((c) => c.visible).length;

  const handleDownload = () => {
    // Le pasamos las reglas de ordenación al motor
    generateExcel(data, columns, rules, sortRules);
  };

  return (
    <section>
      {/* ... JSX del Card ... */}
      <Button onClick={handleDownload} size="lg">
        <Download className="w-4 h-4 mr-2" />
        {t("export.title")}
      </Button>
    </section>
  );
};