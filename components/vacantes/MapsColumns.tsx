"use client";

import React from "react";
import { MapPinned, Key, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { t } from "@/lib/i18n";

interface MapsConfig {
  enabled: boolean;
  apiKey: string;
  addressColumn: string;
}

interface MapsColumnsProps {
  config: MapsConfig;
  onChange: (config: MapsConfig) => void;
}

export const MapsColumns = ({ config, onChange }: MapsColumnsProps) => {
  const handleToggle = (checked: boolean) => {
    onChange({ ...config, enabled: checked });
  };

  const handleInputChange = (field: keyof MapsConfig, value: string) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <section className="mb-8 transition-all duration-500" id="section-maps">
      <h2 className="text-sm font-bold uppercase tracking-wide text-foreground mb-4 flex items-center gap-2">
        <span className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs">
          {t("maps.idSection")}
        </span>
        {t("maps.title")}
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        {t("maps.description")}
      </p>

      <Card className="border-2 border-accent shadow-sm">
        <CardHeader className="border-b-2 border-accent bg-accent/5 py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold uppercase tracking-wide flex items-center gap-2">
              <MapPinned className="w-4 h-4 text-primary" />
              {t("maps.title")}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Checkbox
                id="enable-maps"
                checked={config.enabled}
                onCheckedChange={handleToggle}
              />
              <Label
                htmlFor="enable-maps"
                className="text-xs font-medium cursor-pointer"
              >
                {t("maps.enable")}
              </Label>
            </div>
          </div>
        </CardHeader>

        {config.enabled && (
          <CardContent className="p-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* API KEY INPUT */}
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide flex items-center gap-2">
                  <Key className="w-3 h-3" />
                  {t("maps.apiKeyLabel")}
                </Label>
                <Input
                  type="password"
                  placeholder={t("maps.apiKeyPlaceholder")}
                  value={config.apiKey}
                  onChange={(e) => handleInputChange("apiKey", e.target.value)}
                  className={
                    !config.apiKey
                      ? "border-destructive/50 focus-visible:ring-destructive"
                      : ""
                  }
                />
              </div>

              {/* ADDRESS INPUT */}
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide flex items-center gap-2">
                  <Home className="w-3 h-3" />
                  {t("maps.addressLabel")}
                </Label>
                <Input
                  placeholder={t("maps.addressPlaceholder")}
                  value={config.addressColumn}
                  onChange={(e) =>
                    handleInputChange("addressColumn", e.target.value)
                  }
                  className={
                    !config.addressColumn
                      ? "border-destructive/50 focus-visible:ring-destructive"
                      : ""
                  }
                />
              </div>
            </div>

            {(!config.apiKey || !config.addressColumn) && (
              <p className="text-[10px] text-destructive mt-3 italic">
                * {t("maps.requiredError")}
              </p>
            )}
          </CardContent>
        )}
      </Card>
    </section>
  );
};
