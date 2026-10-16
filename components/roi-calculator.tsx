"use client";

import { useMemo, useState } from "react";

const MONTHS = 12;
const money = (value: number) => `$${Math.round(value).toLocaleString()}`;

function Slider({
  label,
  min,
  max,
  step,
  value,
  display,
  onChange,
}: {
  label: string;
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
        <label className="font-semibold">{label}</label>
        <span className="font-display text-2xl font-semibold text-mk-accent">
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
  const [acv, setAcv] = useState(0);
  const [appointments, setAppointments] = useState(0);
  const [closeRate, setCloseRate] = useState(0);
  const [retainer, setRetainer] = useState(0);
  const [costPerAppointment, setCostPerAppointment] = useState(0);
  const [renewalRate, setRenewalRate] = useState(0);

  // Same model as Lovable's: year one from new deals, year two from renewals,
  // cost is twelve months of retainer plus per-appointment fees.
  const result = useMemo(() => {
    const dealsPerMonth = appointments * (closeRate / 100);
    const yearOneDeals = dealsPerMonth * MONTHS;
    const yearOneRevenue = yearOneDeals * acv;
    const monthlyAppointmentCost = appointments * costPerAppointment;
    const yearOneCost = (retainer + monthlyAppointmentCost) * MONTHS;
    const renewedDeals = yearOneDeals * (renewalRate / 100);
    const yearTwoRevenue = renewedDeals * acv;
    const totalRevenue = yearOneRevenue + yearTwoRevenue;

    return {
      dealsPerMonth,
      yearOneDeals,
      yearOneRevenue,
      yearOneCost,
      monthlyAppointmentCost,
      renewedDeals,
      yearTwoRevenue,
      netReturn: totalRevenue - yearOneCost,
      roi: yearOneCost > 0 ? totalRevenue / yearOneCost : 0,
    };
  }, [acv, appointments, closeRate, retainer, costPerAppointment, renewalRate]);

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
            onChange={setAcv}
          />
          <Slider
            label="New appointments set per month"
            min={0}
            max={50}
            step={1}
            value={appointments}
            display={`${appointments}`}
            onChange={setAppointments}
          />
          <Slider
            label="Close rate on appointments set"
            min={0}
            max={80}
            step={5}
            value={closeRate}
            display={`${closeRate}%`}
            onChange={setCloseRate}
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <label className="font-semibold">
              Monthly retainer
              <input
                type="number"
                min={0}
                step={500}
                value={retainer}
                onChange={(e) => setRetainer(Number(e.target.value) || 0)}
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
                onChange={(e) =>
                  setCostPerAppointment(Math.max(0, Number(e.target.value) || 0))
                }
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
            onChange={setRenewalRate}
          />
        </div>

        <aside className="bg-mk-primary p-8 text-white md:p-12 lg:min-h-full">
          <p className="text-xs font-bold uppercase text-mk-accent">
            Projected return
          </p>
          <p className="mt-4 font-display text-6xl font-semibold">
            {result.roi.toFixed(1)}x
          </p>
          <p className="mt-3 text-white/70">24-month projected ROI</p>

          <div className="mt-12 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <Stat
              label="Deals closed in year 1"
              value={result.yearOneDeals.toFixed(1)}
            />
            <Stat
              label="Revenue in year 1"
              value={money(result.yearOneRevenue)}
            />
            <Stat
              label="Renewed deals in year 2"
              value={result.renewedDeals.toFixed(1)}
            />
            <Stat
              label="Revenue in year 2"
              value={money(result.yearTwoRevenue)}
            />
            <Stat label="Monthly retainer" value={money(retainer)} />
            <Stat
              label="Appointments per month × cost per appointment"
              value={money(result.monthlyAppointmentCost)}
            />
            <Stat label="Total investment" value={money(result.yearOneCost)} />
            <Stat label="Net return" value={money(result.netReturn)} />
          </div>

          <div className="mt-10 border-l-4 border-mk-accent pl-5">
            <p className="font-display text-xl font-semibold">
              {result.dealsPerMonth.toFixed(1)} new deals per month
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Calculated from your appointments set and close rate.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
