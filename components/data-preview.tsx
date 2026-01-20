"use client"

import type { ColumnSettings } from "./column-config"

interface DataPreviewProps {
  data: Record<string, unknown>[]
  columns: ColumnSettings[]
}

export function DataPreview({ data, columns }: DataPreviewProps) {
  const visibleColumns = columns.filter((col) => col.visible)
  const previewData = data.slice(0, 5)

  if (visibleColumns.length === 0) {
    return (
      <div className="border-2 border-accent rounded-md p-8 text-center">
        <p className="text-muted-foreground">No hay columnas visibles para mostrar</p>
      </div>
    )
  }

  return (
    <div className="border-2 border-accent rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              {visibleColumns.map((col) => (
                <th
                  key={col.id}
                  className="px-4 py-3 text-left font-semibold uppercase tracking-wide text-xs whitespace-nowrap"
                  style={{
                    backgroundColor: col.headerColor,
                    color: col.textColor,
                  }}
                >
                  {col.displayName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t border-accent">
                {visibleColumns.map((col) => (
                  <td
                    key={col.id}
                    className="px-4 py-3 whitespace-nowrap"
                    style={{
                      backgroundColor: col.cellColor,
                      color: col.textColor,
                    }}
                  >
                    {String(row[col.originalName] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length > 5 && (
        <div className="px-4 py-2 bg-muted text-center text-xs text-muted-foreground border-t border-accent">
          Mostrando 5 de {data.length} filas
        </div>
      )}
    </div>
  )
}
