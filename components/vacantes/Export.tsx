"use client";

import { AlertCircle, Download, FileCheck } from "lucide-react";
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
  mapsConfig: { enabled: boolean; apiKey: string; addressColumn: string };
}

export const Export = ({ data, columns, rules, sortRules, mapsConfig }: ExportProps) => {
  const visibleColumnsCount = columns.filter((c) => c.visible).length;

  const handleDownload = () => {
    // Le pasamos las reglas de ordenación al motor
    generateExcel(data, columns, rules, sortRules);
  };

  const isMapsInvalid = mapsConfig.enabled && (
    !mapsConfig.apiKey.trim() || !mapsConfig.addressColumn.trim()
  );

  const scrollToMaps = () => {
    if (isMapsInvalid) {
      const element = document.getElementById("section-maps");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        // Opcional: un pequeño flash visual para llamar la atención
        element.classList.add("ring-2", "ring-destructive");
        setTimeout(() => element.classList.remove("ring-2", "ring-destructive"), 2000);
      }
    }
  };

  return (
<section className="mt-8 flex flex-col items-center">
      {/* Envolvemos en un div para capturar el click incluso si el botón está disabled */}
      <div 
        onClick={scrollToMaps} 
        className={isMapsInvalid ? "cursor-help w-full flex justify-center" : "w-full flex justify-center"}
      >
        <Button 
          onClick={(e) => {
            if (isMapsInvalid) e.stopPropagation();
            else handleDownload();
          }} 
          size="lg" 
          disabled={isMapsInvalid}
          className="relative group"
        >
          <Download className="w-4 h-4 mr-2" />
          {t("export.title")}
          
          {isMapsInvalid && (
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-destructive text-destructive-foreground text-[10px] px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              <AlertCircle className="w-3 h-3 inline mr-1" />
              {t("maps.clickToFix")}
            </span>
          )}
        </Button>
      </div>
    </section>
  );
};