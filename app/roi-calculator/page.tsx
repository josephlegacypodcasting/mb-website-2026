import type { Metadata } from "next";
import { RoiCalculator } from "@/components/roi-calculator";

export const metadata: Metadata = {
  title: "ROI Calculator | Market Better",
  description:
    "Model the return from qualified meetings using your own contract value, close rate, retainer, and cost per appointment.",
};

export default function RoiCalculatorPage() {
  return (
    <main>
      <section className="px-6 py-20 md:px-12 md:py-28 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <p className="mk-kicker">ROI</p>
          <h1 className="max-w-5xl font-display text-6xl font-semibold uppercase leading-[.96] md:text-8xl">
            See what your pipeline{" "}
            <span className="text-mk-accent">could produce.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-xl leading-relaxed text-mk-muted-fg">
            Use your annual contract value and sales assumptions to model the
            return from qualified meetings.
          </p>
        </div>
      </section>

      <RoiCalculator />
    </main>
  );
}
