"use client"

import React from "react"

import { GripVertical, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { t } from "@/lib/i18n"

export interface ColumnSettings {
  id: string
  originalName: string
  displayName: string
  visible: boolean
  headerColor: string
  cellColor: string
  textColor: string
  order: number
}

interface ColumnConfigProps {
  columns: ColumnSettings[]
  onColumnsChange: (columns: ColumnSettings[]) => void
  onDragStart: (e: React.DragEvent, index: number) => void
  onDragOver: (e: React.DragEvent, index: number) => void
  onDragEnd: () => void
  draggedIndex: number | null
}

export function ColumnConfig({
  columns,
  onColumnsChange,
  onDragStart,
  onDragOver,
  onDragEnd,
  draggedIndex,
}: ColumnConfigProps) {
  const updateColumn = (id: string, updates: Partial<ColumnSettings>) => {
    onColumnsChange(
      columns.map((col) => (col.id === id ? { ...col, ...updates } : col))
    )
  }

  const toggleVisibility = (id: string) => {
    const column = columns.find((c) => c.id === id)
    if (column) {
      updateColumn(id, { visible: !column.visible })
    }
  }

  return (
    <div className="space-y-3">
      {columns.map((column, index) => (
        <div
          key={column.id}
          draggable
          onDragStart={(e) => onDragStart(e, index)}
          onDragOver={(e) => onDragOver(e, index)}
          onDragEnd={onDragEnd}
          className={`border-2 rounded-md p-4 transition-all ${
            draggedIndex === index
              ? "opacity-50 border-primary"
              : "border-accent hover:border-primary/50"
          } ${!column.visible ? "opacity-60" : ""}`}
        >
          <div className="flex items-start gap-3">
            <div className="cursor-grab active:cursor-grabbing pt-2">
              <GripVertical className="w-5 h-5 text-muted-foreground" />
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {column.originalName}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleVisibility(column.id)}
                  className="h-8 w-8 p-0"
                >
                  {column.visible ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <div>
                <Label className="text-xs uppercase tracking-wide">{t("configureOrder.cardName")}</Label>
                <Input
                  value={column.displayName}
                  onChange={(e) => updateColumn(column.id, { displayName: e.target.value })}
                  className="mt-1 border-2 border-accent"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs uppercase tracking-wide">{t("configureOrder.cardHeader")}</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="color"
                      value={column.headerColor}
                      onChange={(e) => updateColumn(column.id, { headerColor: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer border-2 border-accent"
                    />
                    <Input
                      value={column.headerColor}
                      onChange={(e) => updateColumn(column.id, { headerColor: e.target.value })}
                      className="text-xs border-2 border-accent"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wide">{t("configureOrder.cardCell")}</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="color"
                      value={column.cellColor}
                      onChange={(e) => updateColumn(column.id, { cellColor: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer border-2 border-accent"
                    />
                    <Input
                      value={column.cellColor}
                      onChange={(e) => updateColumn(column.id, { cellColor: e.target.value })}
                      className="text-xs border-2 border-accent"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wide">{t("configureOrder.cardText")}</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="color"
                      value={column.textColor}
                      onChange={(e) => updateColumn(column.id, { textColor: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer border-2 border-accent"
                    />
                    <Input
                      value={column.textColor}
                      onChange={(e) => updateColumn(column.id, { textColor: e.target.value })}
                      className="text-xs border-2 border-accent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
