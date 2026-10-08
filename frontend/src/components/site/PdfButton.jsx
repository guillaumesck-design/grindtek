import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const PdfButton = ({ machine, className = "", testId }) => {
  const [busy, setBusy] = useState(false);
  const go = async () => {
    setBusy(true);
    try {
      const { downloadSpecPdf } = await import("@/lib/specPdf");
      await downloadSpecPdf(machine);
    } catch {
      toast.error("Impossible de générer la fiche PDF.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <button data-testid={testId} onClick={go} disabled={busy} className={className}>
      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
      Fiche PDF
    </button>
  );
};
