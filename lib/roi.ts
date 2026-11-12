export type RoiInputs = {
  /** Average contract value, dollars. */
  acv: number;
  /** New appointments set per month. */
  appts: number;
  /** Close rate as a decimal (30% = 0.30). */
  close: number;
  /** Days from appointment to signed deal. */
  cycleDays: number;
  /** Monthly retainer, dollars. */
  retainer: number;
  /** Cost per appointment, dollars. */
  cpa: number;
  /** Year-two renewal rate as a decimal. */
  renew: number;
};

export type RoiResult = {
  dealsY1: number;
  revY1: number;
  revY2: number;
  renewed: number;
  investment: number;
  totalRevenue: number;
  netReturn: number;
  /** Null when there is no investment to divide by. */
  multiple: number | null;
};

/** Months of appointment setting, which is also the investment period. */
export const ROI_ENGAGEMENT_MONTHS = 12;
const ROI_HORIZON_MONTHS = 24;

/**
 * The calculation from Mike's developer brief (2026-11-11), section 4, ported
 * as written. That brief is the source of truth; do not "tidy" the math.
 *
 * - Appointments are set in months 1–12 only.
 * - A sales cycle of `cycleDays / 30` months delays signing. A partial month
 *   splits a month's deals across two neighbouring months.
 * - Each signed deal pays ACV/12 a month for 12 months from the month it signs,
 *   rather than the whole ACV on signing — the flaw this replaced.
 * - Renewals start a second 12-month term the month after the first ends.
 * - Only months 1–24 are counted; anything later is left out.
 */
export function calculateRoi(i: RoiInputs): RoiResult {
  const ENGAGE = ROI_ENGAGEMENT_MONTHS;
  const HORIZON = ROI_HORIZON_MONTHS;
  const dealsPerMonth = i.appts * i.close;
  const cm = i.cycleDays / 30;
  const whole = Math.floor(cm);
  const part = cm - whole;

  // Deals signed in each month. Appointments are only set in months 1 to 12.
  const from = (src: number) => (src >= 1 && src <= ENGAGE ? dealsPerMonth : 0);
  const closes: number[] = [];
  for (let m = 1; m <= HORIZON; m++) {
    closes[m] = from(m - whole) * (1 - part) + from(m - whole - 1) * part;
  }

  let dealsY1 = 0;
  let revY1 = 0;
  let revY2 = 0;
  let renewed = 0;
  for (let m = 1; m <= HORIZON; m++) {
    let rev = 0;
    for (let c = 1; c <= m; c++) {
      if (m <= c + 11) rev += (closes[c] * i.acv) / 12; // first 12-month term
      else if (m <= c + 23) rev += (closes[c] * i.renew * i.acv) / 12; // renewal term
    }
    if (m <= 12) {
      revY1 += rev;
      dealsY1 += closes[m];
    } else {
      revY2 += rev;
      renewed += closes[m - 12] * i.renew;
    }
  }

  const investment = (i.retainer + i.appts * i.cpa) * ENGAGE;
  const totalRevenue = revY1 + revY2;
  return {
    dealsY1,
    revY1,
    revY2,
    renewed,
    investment,
    totalRevenue,
    netReturn: totalRevenue - investment,
    multiple: investment > 0 ? totalRevenue / investment : null,
  };
}

/**
 * Normalized shape of what a prospect modelled in the ROI calculator, so it can
 * ride along with a contact-form submission.
 *
 * `costBasisMonths` travels with the numbers because the multiple divides 24
 * months of collected revenue by 12 months of investment, so it is never
 * compared to a differently-based figure as if the two meant the same thing.
 */
export type RoiSnapshot = {
  acv: number;
  appointmentsPerMonth: number;
  closeRatePct: number;
  salesCycleDays: number;
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
  "salesCycleDays",
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
    `${roi.salesCycleDays}-day cycle`,
    `${roi.renewalRatePct}% renewal`,
  ].join(" · ");

  return (
    `${assumptions} → ${roi.multiple.toFixed(1)}x ` +
    `on ${money(roi.totalInvestment)} over ${roi.costBasisMonths} months ` +
    `(${money(roi.netReturn)} net)`
  );
}
