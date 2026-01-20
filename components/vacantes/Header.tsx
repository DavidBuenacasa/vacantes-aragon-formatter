import { FileSpreadsheet } from "lucide-react";

export function Header({}: {}) {
  return (
      <header className="border-b-2 border-accent bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-primary flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground uppercase tracking-wide">
                Vacantes Aragón Formatter
              </h1>
              <p className="text-sm text-muted-foreground">
                Formatea tu Excel de vacantes educativas
              </p>
            </div>
          </div>
        </div>
      </header>
  );
}
