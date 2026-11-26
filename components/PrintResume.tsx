import type { ResumeData } from "@/lib/data";
import ResumeDocument from "@/components/ResumeDocument";

/**
 * Clean, single-column, black-on-white résumé. Hidden on screen (`.print-only`)
 * and revealed only by the print stylesheet when the visitor clicks
 * "download résumé (.pdf)" / hits Ctrl-P. Keeping a separate print layout means
 * the on-screen terminal aesthetic never has to compromise PDF readability.
 *
 * Runs multiple pages when the full work history needs it — there's no
 * length cap here; every role gets its full bullet list rather than being
 * truncated to fit one sheet.
 *
 * The actual markup lives in <ResumeDocument>, shared with the admin
 * "tailored résumé" viewer so both render identically.
 *
 * Typography/color for this layout live in the `@media print` block of
 * globals.css (proportional font, single dark-green accent on headings).
 */
export default function PrintResume({ data }: { data: ResumeData }) {
  const { profile, socials, experience, skills, education } = data;
  return (
    <div className="print-only mx-auto max-w-3xl text-black">
      <ResumeDocument
        profile={profile}
        socials={socials}
        skills={skills}
        experience={experience}
        education={education}
        summary={profile.tagline}
      />
    </div>
  );
}
