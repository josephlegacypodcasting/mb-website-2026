import { NextResponse } from "next/server";
import {
  ROI_NUMERIC_FIELDS,
  formatRoiSummary,
  type RoiSnapshot,
} from "@/lib/roi";

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

const round = (value: number, decimals = 0) => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

/**
 * The ROI block is optional and advisory — it describes what the prospect
 * modelled, not anything we act on — but it is still client-supplied, so every
 * field is coerced. A snapshot missing or corrupting any field is dropped
 * whole rather than forwarded half-populated, which would be worse than
 * absent: a partial model reads as a real one in the CRM.
 */
function parseRoi(value: unknown): RoiSnapshot | null {
  if (!value || typeof value !== "object") return null;

  const raw = value as Record<string, unknown>;
  const parsed = {} as Record<string, number>;

  for (const field of ROI_NUMERIC_FIELDS) {
    const numeric = Number(raw[field]);
    if (!Number.isFinite(numeric)) return null;
    parsed[field] = numeric;
  }

  return parsed as unknown as RoiSnapshot;
}

/**
 * Flattened into prefixed top-level keys rather than sent as a nested object:
 * GoHighLevel maps inbound webhook fields one by one, and nested paths are
 * awkward to wire up there.
 */
function roiFields(roi: RoiSnapshot | null) {
  if (!roi) return { roi_used: false };

  return {
    roi_used: true,
    roi_acv: round(roi.acv),
    roi_appointments_per_month: round(roi.appointmentsPerMonth, 1),
    roi_close_rate_pct: round(roi.closeRatePct, 1),
    roi_monthly_retainer: round(roi.monthlyRetainer),
    roi_cost_per_appointment: round(roi.costPerAppointment),
    roi_renewal_rate_pct: round(roi.renewalRatePct, 1),
    roi_deals_per_month: round(roi.dealsPerMonth, 1),
    roi_deals_year_1: round(roi.dealsYear1, 1),
    roi_revenue_year_1: round(roi.revenueYear1),
    roi_renewed_deals_year_2: round(roi.renewedDealsYear2, 1),
    roi_revenue_year_2: round(roi.revenueYear2),
    roi_total_investment: round(roi.totalInvestment),
    roi_net_return: round(roi.netReturn),
    roi_multiple: round(roi.multiple, 1),
    // The two versions divide by a different number of months, so the
    // multiple is only comparable within one of them.
    roi_cost_basis_months: round(roi.costBasisMonths),
    roi_summary: formatRoiSummary(roi),
  };
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
        ...roiFields(parseRoi(body.roi)),
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
