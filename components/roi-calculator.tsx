"use client";

import { useEffect, useMemo, useState } from "react";
import { useRoi } from "@/components/roi-context";
import { ROI_ENGAGEMENT_MONTHS, calculateRoi } from "@/lib/roi";

const money = (value: number) => `$${Math.round(value).toLocaleString()}`;

function Slider({
  label,
  helper,
  min,
  max,
  step,
  value,
  display,
  onChange,
}: {
  label: string;
  helper?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  display: string;
  onChange: (value: number) => void;
}) {
  const fill = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <div className="border-b border-mk-border py-6">
      <div className="mb-5 flex items-end justify-between gap-6">
        <div>
          <label className="font-semibold">{label}</label>
          {helper ? (
            <p className="mt-1 text-sm text-mk-muted-fg">{helper}</p>
          ) : null}
        </div>
        <span className="shrink-0 font-display text-2xl font-semibold text-mk-accent">
          {display}
        </span>
      </div>
      <input
        type="range"
        className="mk-range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ "--fill": `${fill}%` } as React.CSSProperties}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-white/25 py-5">
      <p className="text-sm text-white/65">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
    </div>
  );
}

export function RoiCalculator() {
  // Defaults from Mike's developer brief (2026-11-11). They are only a
  // starting point on screen: nothing is reported to the contact form until
  // the prospect moves a control (see `track`).
  const [acv, setAcv] = useState(20000);
  const [appointments, setAppointments] = useState(6);
  const [closeRate, setCloseRate] = useState(30);
  const [salesCycle, setSalesCycle] = useState(90);
  const [retainer, setRetainer] = useState(3500);
  const [costPerAppointment, setCostPerAppointment] = useState(400);
  const [renewalRate, setRenewalRate] = useState(0);

  const { reportRoi } = useRoi();
  const [touched, setTouched] = useState(false);

  // Every control goes through this. The snapshot is only reported once the
  // prospect has actually moved something, so a lead never carries numbers
  // they did not choose.
  const track =
    <T,>(set: (value: T) => void) =>
    (value: T) => {
      setTouched(true);
      set(value);
    };

  const result = useMemo(
    () =>
      calculateRoi({
        acv,
        appts: appointments,
        close: closeRate / 100,
        cycleDays: salesCycle,
        retainer,
        cpa: costPerAppointment,
        renew: renewalRate / 100,
      }),
    [acv, appointments, closeRate, salesCycle, retainer, costPerAppointment, renewalRate],
  );

  useEffect(() => {
    if (!touched) return;

    reportRoi({
      acv,
      appointmentsPerMonth: appointments,
      closeRatePct: closeRate,
      salesCycleDays: salesCycle,
      monthlyRetainer: retainer,
      costPerAppointment,
      renewalRatePct: renewalRate,
      dealsPerMonth: appointments * (closeRate / 100),
      dealsYear1: result.dealsY1,
      revenueYear1: result.revY1,
      renewedDealsYear2: result.renewed,
      revenueYear2: result.revY2,
      totalInvestment: result.investment,
      netReturn: result.netReturn,
      // The server requires every field to be finite; 0 stands in for "no
      // investment to divide by", as the on-screen "—" does.
      multiple: result.multiple ?? 0,
      costBasisMonths: ROI_ENGAGEMENT_MONTHS,
    });
  }, [
    touched,
    result,
    acv,
    appointments,
    closeRate,
    salesCycle,
    retainer,
    costPerAppointment,
    renewalRate,
    reportRoi,
  ]);

  const numberInputClass =
    "mt-3 h-12 w-full border border-mk-border bg-mk-card px-4 font-normal outline-none focus-visible:ring-2 focus-visible:ring-mk-accent";

  return (
    <section className="border-t border-mk-fg/15 px-6 pb-28 md:px-12 lg:px-20">
      <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[1.1fr_.9fr]">
        <div className="py-14 lg:pr-16">
          <p className="mb-4 text-xs font-bold uppercase text-mk-accent">
            Your numbers
          </p>

          <Slider
            label="Average contract value (ACV)"
            min={0}
            max={500000}
            step={1000}
            value={acv}
            display={money(acv)}
            onChange={track(setAcv)}
          />
          <Slider
            label="New appointments set per month"
            min={0}
            max={50}
            step={1}
            value={appointments}
            display={`${appointments}`}
            onChange={track(setAppointments)}
          />
          <Slider
            label="Close rate on appointments set"
            min={0}
            max={80}
            step={5}
            value={closeRate}
            display={`${closeRate}%`}
            onChange={track(setCloseRate)}
          />
          <Slider
            label="Sales cycle"
            helper="Days from appointment to signed deal."
            min={0}
            max={360}
            step={15}
            value={salesCycle}
            display={salesCycle === 0 ? "Same month" : `${salesCycle} days`}
            onChange={track(setSalesCycle)}
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <label className="font-semibold">
              Monthly retainer
              <input
                type="number"
                min={0}
                step={500}
                value={retainer}
                onChange={(e) => {
                  setTouched(true);
                  setRetainer(Number(e.target.value) || 0);
                }}
                className={numberInputClass}
              />
            </label>
            <label className="font-semibold">
              Cost Per Appointment
              <input
                type="number"
                min={0}
                step={50}
                value={costPerAppointment}
                onChange={(e) => {
                  setTouched(true);
                  setCostPerAppointment(Math.max(0, Number(e.target.value) || 0));
                }}
                className={numberInputClass}
              />
            </label>
          </div>

          <Slider
            label="Client renewal rate (year 2)"
            min={0}
            max={100}
            step={5}
            value={renewalRate}
            display={`${renewalRate}%`}
            onChange={track(setRenewalRate)}
          />
        </div>

        <aside className="bg-mk-primary p-8 text-white md:p-12 lg:min-h-full">
          <p className="text-xs font-bold uppercase text-mk-accent">
            Projected return
          </p>
          <p className="mt-4 font-display text-6xl font-semibold">
            {result.multiple === null ? "—" : `${result.multiple.toFixed(1)}x`}
          </p>
          <p className="mt-3 text-white/70">
            Revenue collected over 24 months, divided by total investment
          </p>

          <div className="mt-12 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <Stat
              label="Deals closed in year 1"
              value={result.dealsY1.toFixed(1)}
            />
            <Stat
              label="Revenue collected in year 1"
              value={money(result.revY1)}
            />
            <Stat
              label="Renewed deals in year 2"
              value={result.renewed.toFixed(1)}
            />
            <Stat
              label="Year 2 revenue from year 1 deals"
              value={money(result.revY2)}
            />
            <Stat
              label="Total investment (12 months)"
              value={money(result.investment)}
            />
            <Stat
              label="Net return (24 months)"
              value={money(result.netReturn)}
            />
          </div>
        </aside>
      </div>
    </section>
  );
}
