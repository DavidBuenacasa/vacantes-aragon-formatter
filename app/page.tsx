"use client";

import React from "react";

import { useState } from "react";
import XLSX from "xlsx-js-style";
import { Download, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ColumnConfig, type ColumnSettings } from "@/components/column-config";
import { DataPreview } from "@/components/data-preview";
import { DEFAULT_RULES, DEFAULT_SORT, DEFAULT_COLORS } from "@/lib/defaults";
import { ConditionalRule, SortConfig } from "@/types";
import { UploadFile } from "@/components/vacantes/UploadFile";
import { Header } from "@/components/vacantes/Header";
import { ConditionalRules } from "@/components/vacantes/CondicionalRules";
import { SortRules } from "@/components/vacantes/SortRules";
import { ConfigureOrder } from "@/components/vacantes/ConfigureOrder";
import { Preview } from "@/components/vacantes/Preview";
import { Export } from "@/components/vacantes/Export";

export default function VacantesAragonFormatter() {
  const [excelData, setExcelData] = useState<Record<string, unknown>[]>([]);
  const [columns, setColumns] = useState<ColumnSettings[]>([]);
  const [rules, setRules] = useState<ConditionalRule[]>(DEFAULT_RULES);
  const [sortRules, setSortRules] = useState<SortConfig[]>(DEFAULT_SORT);

  const handleDataReady = (
    data: any[],
    cols: ColumnSettings[],
    activeRules: ConditionalRule[],
    activeSort: SortConfig[],
  ) => {
    setExcelData(data);
    setColumns(cols);
    setRules(activeRules);
    setSortRules(activeSort);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <Header></Header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Step 1: Upload */}
        <UploadFile onDataLoaded={handleDataReady} />
        {columns.length > 0 && (
          <>
            {/* Step 2.5: Reglas Condicionales */}
            <ConditionalRules
              rules={rules}
              columns={columns}
              onRulesChange={setRules}
            />

            {/* Step 2.7: Ordenación */}
            <SortRules
              sortRules={sortRules}
              columns={columns}
              onSortRulesChange={setSortRules}
            />

            {/* Step 2: Configure Order */}
            <ConfigureOrder columns={columns} onColumnsChange={setColumns} />

            {/* Step 3: Preview */}
            <Preview data={excelData} columns={columns} sortRules={sortRules} />

            {/* Step 4: Export */}
            <Export data={excelData} columns={columns} rules={rules} sortRules={sortRules}/>
          </>
        )}
      </div>
    </main>
  );
}
