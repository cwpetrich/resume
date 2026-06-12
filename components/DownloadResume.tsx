"use client";

import { useEffect } from "react";

/**
 * Triggers the browser's print dialog. The print stylesheet in globals.css
 * hides all interactive chrome and reveals a clean, ATS-friendly résumé
 * layout (see <PrintResume />), which the user saves as a PDF.
 *
 * Browsers name the saved PDF after `document.title`, so while the print
 * dialog is open we swap in `pdfTitle` ("Name — Résumé") and restore the
 * SEO title afterwards. The beforeprint/afterprint listeners cover Ctrl-P too.
 */
export default function DownloadResume({
  pdfTitle,
  className = "",
}: {
  pdfTitle: string;
  className?: string;
}) {
  useEffect(() => {
    let original = document.title;
    const before = () => {
      original = document.title;
      document.title = pdfTitle;
    };
    const after = () => {
      document.title = original;
    };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, [pdfTitle]);

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
