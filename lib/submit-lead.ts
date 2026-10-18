import type { RoiSnapshot } from "@/lib/roi";

/**
 * Shared by both versions' contact forms. `source` is what tells them apart
 * once leads land in the CRM — there are two designs live at once, and we need
 * to know which one produced a lead.
 */
export type LeadStatus = "idle" | "sending" | "sent" | "error";

/**
 * `roi` is whatever the prospect modelled in the ROI calculator during this
 * visit, or null if they never touched it. Omitted from the request entirely
 * in that case, so a lead with no ROI block means "did not engage with it"
 * rather than "modelled all zeroes".
 */
export async function submitLead(
  form: HTMLFormElement,
  source: string,
  roi: RoiSnapshot | null,
) {
  const data = new FormData(form);

  const response = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: data.get("name"),
      phone: data.get("phone"),
      email: data.get("email"),
      source,
      ...(roi ? { roi } : {}),
    }),
  });

  if (!response.ok) {
    throw new Error(`Lead submission failed with ${response.status}`);
  }
}
