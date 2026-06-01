"use client";

/**
 * Triggers the browser's print dialog. The print stylesheet in globals.css
 * hides all interactive chrome and reveals a clean, ATS-friendly résumé
 * layout (see <PrintResume />), which the user saves as a PDF.
 */
export default function DownloadResume({
  className = "",
}: {
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={
        "rounded border border-term-accent bg-term-accent/10 px-4 py-2 text-sm font-semibold text-term-accent transition-colors hover:bg-term-accent/20 " +
        className
      }
    >
      ⤓ download résumé (.pdf)
    </button>
  );
}
