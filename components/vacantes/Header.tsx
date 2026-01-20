import { FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { Tooltip } from "recharts";

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
        <div className="absolute top-6 right-6">
          <Button
            variant="ghost"
            size="icon"
            title="Ver código en GitHub" // Tooltip nativo del navegador
            className="w-12 h-12 rounded-full hover:bg-accent hover:text-primary hover:scale-110 active:scale-95 transition-all duration-200"
            asChild
          >
            <a
              href="https://github.com/DavidBuenacasa/vacantes-aragon-formatter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/GitHub_Invertocat_Black_Clearspace.svg"
                alt="GitHub Logo"
                className="w-30 h-30"
              />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
