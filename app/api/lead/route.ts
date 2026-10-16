import { NextResponse } from "next/server";

/*
 * Contact form destination.
 *
 * This forwards to a LeadConnector (GoHighLevel) inbound webhook. It runs on the
 * server rather than posting from the browser for two reasons:
 *
 *   1. The webhook URL is an unauthenticated capability — anyone holding it can
 *      write leads into the CRM. Both repos are public, so it stays in the
 *      environment and never reaches the client bundle.
 *   2. A cross-origin POST with a JSON content type triggers a CORS preflight
 *      that the webhook does not answer.
 */

const MAX_FIELD_LENGTH = 300;

// Deliberately permissive: the only goal is to reject obvious non-addresses
// before they reach the CRM. Real validation is a confirmation email's job.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, MAX_FIELD_LENGTH) : "";
}

export async function POST(request: Request) {
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;

  if (!webhookUrl) {
    // Loud on the server, vague to the caller: a misconfigured deploy must not
    // look like a successful submission.
    console.error("LEAD_WEBHOOK_URL is not set — lead was dropped.");
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const body = (payload ?? {}) as Record<string, unknown>;
  const name = clean(body.name);
  const phone = clean(body.phone);
  const email = clean(body.email);
  const source = clean(body.source) || "unknown";

  if (!name || !phone || !email || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }

  let response: Response;
  try {
    response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        email,
        source,
        submitted_at: new Date().toISOString(),
      }),
      // Without this a hanging webhook holds the request open indefinitely.
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    console.error("Lead webhook unreachable:", error);
    return NextResponse.json({ error: "upstream_unreachable" }, { status: 502 });
  }

  if (!response.ok) {
    console.error(`Lead webhook returned ${response.status}.`);
    return NextResponse.json({ error: "upstream_error" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
