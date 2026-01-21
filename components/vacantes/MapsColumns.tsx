"use client";

import { useState } from "react";
import { MapPinned, Key, Loader2, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ColumnSettings } from "../column-config";
import { DEFAULT_COLORS } from "@/lib/defaults";
import { t } from "@/lib/i18n";

interface MapsConfig {
  enabled: boolean;
  apiKey: string;
  originAddress: string;
}

interface MapsColumnsProps {
  config: MapsConfig;
  onChange: (config: MapsConfig) => void;
  data: any[];
  onDataProcessed: (newData: any[]) => void;
  columns: any[];
  onColumnsChange: (newCols: any[]) => void;
}

export const MapsColumns = ({
  config,
  onChange,
  data,
  onDataProcessed,
  columns,
  onColumnsChange,
}: MapsColumnsProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Nombres fijos de las columnas en tu Excel original
  const COLUMNA_CENTRO = "NOMBRE CENTRO";
  const COLUMNA_PROVINCIA = "PROVINCIA CENTRO";

  const processMapsData = async () => {
    if (!config.apiKey || !config.originAddress || data.length === 0) return;

    setIsProcessing(true);
    setIsDone(false);

    try {
      const enrichedData = await Promise.all(
        data.map(async (row) => {
          const centro = row[COLUMNA_CENTRO];
          const provincia = row[COLUMNA_PROVINCIA] || "Aragón";

          if (!centro)
            return { ...row, "DISTANCIA KM": "-", "TIEMPO EN COCHE": "-" };

          const destination = `${centro}, ${provincia}, España`;

          try {
            const url = `/api/maps?origins=${encodeURIComponent(config.originAddress)}&destinations=${encodeURIComponent(destination)}&key=${config.apiKey}`;

            const response = await fetch(url);
            const resData = await response.json();

            if (
              resData.status === "OK" &&
              resData.rows[0].elements[0].status === "OK"
            ) {
              const element = resData.rows[0].elements[0];
              // IMPORTANTE: Guardamos con el mismo nombre que la columna
              return {
                ...row,
                "DISTANCIA KM": element.distance.text,
                "TIEMPO EN COCHE": element.duration.text,
              };
            }
          } catch (err) {
            console.error("Error en Google Maps API:", err);
          }
          return {
            ...row,
            "DISTANCIA KM": "Error",
            "TIEMPO EN COCHE": "Error",
          };
        }),
      );

      // 1. Actualizar los datos de las filas
      onDataProcessed(enrichedData);

      // 2. Crear las definiciones de columnas si no existen
      const newColumns = [...columns];
      const mapsFieldNames = ["DISTANCIA KM", "TIEMPO EN COCHE"];
      let changed = false;

      mapsFieldNames.forEach((name) => {
        const exists = newColumns.find((c) => c.originalName === name);
        if (!exists) {
          newColumns.push({
            id: crypto.randomUUID(),
            originalName: name,
            displayName: name,
            visible: true,
            order: newColumns.length,
            // VALORES DE ESTILO POR DEFECTO
            headerColor: DEFAULT_COLORS.header, // Un gris muy claro o blanco
            cellColor: DEFAULT_COLORS.cell, // Blanco
            textColor: DEFAULT_COLORS.text, // Negro
          } as ColumnSettings);
          changed = true;
        }
      });

      if (changed) {
        onColumnsChange(newColumns);
      }

      setIsDone(true);
    } catch (error) {
      console.error("Error general:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-sm font-bold uppercase tracking-wide text-foreground mb-4 flex items-center gap-2">
        <span className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs">
          {t("maps.idSection")}
        </span>
        {t("maps.title")}
      </h2>
      <Card
        className={`border-2 ${config.enabled ? "border-primary" : "border-accent"}`}
      >
        <CardHeader className="bg-accent/5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <MapPinned className="w-4 h-4" /> {t("maps.enable")}
            </CardTitle>
            <Checkbox
              checked={config.enabled}
              onCheckedChange={(v) => onChange({ ...config, enabled: !!v })}
            />
          </div>
        </CardHeader>
        {config.enabled && (
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("maps.addressLabel")}</Label>
                <Input
                  value={config.originAddress}
                  onChange={(e) =>
                    onChange({ ...config, originAddress: e.target.value })
                  }
                  placeholder={t("maps.addressPlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    {t("maps.apiKeyLabel")}
                  </Label>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1"
                    onClick={() =>
                      window.open(
                        "https://developers.google.com/maps/documentation/distance-matrix/get-api-key",
                        "_blank",
                      )
                    }
                  >
                    <HelpCircle className="w-3 h-3" />
                    {t("maps.apiKeyHelp")}
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    type="password"
                    value={config.apiKey}
                    onChange={(e) =>
                      onChange({ ...config, apiKey: e.target.value })
                    }
                    placeholder={t("maps.apiKeyPlaceholder")}
                    className="pr-10"
                  />
                  <Key className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground/50" />
                </div>
              </div>
            </div>
            <Button
              onClick={processMapsData}
              disabled={isProcessing || !config.apiKey}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  {t("maps.processing")}
                </>
              ) : (
                t("maps.button")
              )}
            </Button>
            {isDone && (
              <p className="text-xs text-green-600 text-center">
                {t("maps.success")}
              </p>
            )}
          </CardContent>
        )}
      </Card>
    </section>
  );
};
