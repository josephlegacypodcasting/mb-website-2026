/**
 * Normalized shape of what a prospect modelled in the ROI calculator, so it can
 * ride along with a contact-form submission.
 *
 * Both versions' calculators map their own internal result objects into this —
 * they use different field names, and, more importantly, a different cost
 * basis: the in-house model divides 24 months of revenue by 24 months of cost,
 * while Mike's reproduces Lovable and divides by 12. `costBasisMonths` travels
 * with the numbers so `multiple` is never compared across versions as if the
 * two meant the same thing.
 */
export type RoiSnapshot = {
  acv: number;
  appointmentsPerMonth: number;
  closeRatePct: number;
  monthlyRetainer: number;
  costPerAppointment: number;
  renewalRatePct: number;

  dealsPerMonth: number;
  dealsYear1: number;
  revenueYear1: number;
  renewedDealsYear2: number;
  revenueYear2: number;
  totalInvestment: number;
  netReturn: number;
  multiple: number;

  costBasisMonths: number;
};

export const ROI_NUMERIC_FIELDS = [
  "acv",
  "appointmentsPerMonth",
  "closeRatePct",
  "monthlyRetainer",
  "costPerAppointment",
  "renewalRatePct",
  "dealsPerMonth",
  "dealsYear1",
  "revenueYear1",
  "renewedDealsYear2",
  "revenueYear2",
  "totalInvestment",
  "netReturn",
  "multiple",
  "costBasisMonths",
] as const satisfies readonly (keyof RoiSnapshot)[];

const money = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

/**
 * One human-readable line, so whoever picks the lead up in the CRM sees the
 * context without expanding fifteen custom fields.
 */
export function formatRoiSummary(roi: RoiSnapshot): string {
  const assumptions = [
    `${money(roi.acv)} ACV`,
    `${roi.appointmentsPerMonth} appts/mo`,
    `${roi.closeRatePct}% close`,
    `${roi.renewalRatePct}% renewal`,
  ].join(" · ");

  return (
    `${assumptions} → ${roi.multiple.toFixed(1)}x ` +
    `on ${money(roi.totalInvestment)} over ${roi.costBasisMonths} months ` +
    `(${money(roi.netReturn)} net)`
  );
}
