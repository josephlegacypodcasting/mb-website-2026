/**
 * Shared by both versions' contact forms. `source` is what tells them apart
 * once leads land in the CRM — there are two designs live at once, and we need
 * to know which one produced a lead.
 */
export type LeadStatus = "idle" | "sending" | "sent" | "error";

export async function submitLead(form: HTMLFormElement, source: string) {
  const data = new FormData(form);

  const response = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: data.get("name"),
      phone: data.get("phone"),
      email: data.get("email"),
      source,
    }),
  });

  if (!response.ok) {
    throw new Error(`Lead submission failed with ${response.status}`);
  }
}
