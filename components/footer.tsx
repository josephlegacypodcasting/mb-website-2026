"use client";

import { useState } from "react";
import { ArrowRight } from "./icons";

/*
 * The footer doubles as the contact section (#contact), which the pricing CTAs
 * anchor to.
 *
 * NOT WIRED TO A BACKEND. The Lovable original posts these fields straight into
 * a Supabase `lead_submissions` table using a publishable key baked into its
 * public bundle. That is deliberately not reproduced here — see the README —
 * so this build cannot silently swallow real leads.
 */
export function SiteFooter() {
  const [submitted, setSubmitted] = useState(false);

  const inputClass =
    "mt-3 h-14 w-full rounded-full border-0 bg-mk-bg px-6 text-mk-fg outline-none focus-visible:ring-2 focus-visible:ring-mk-accent";

  return (
    <footer id="contact" className="bg-mk-primary text-white">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 md:px-12 md:py-28 lg:grid-cols-[.9fr_1.1fr] lg:gap-24 lg:px-20">
        <div>
          <p className="mb-5 text-xs font-bold uppercase text-mk-accent">
            Let&rsquo;s connect &rarr;
          </p>
          <h2 className="max-w-xl font-display text-5xl font-semibold leading-[1.02] md:text-7xl">
            Ready to turn content into pipeline
            <span className="text-mk-accent">?</span>
          </h2>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-white/75">
            We help service-based businesses turn their ideal buyers into
            prospects through content and booked sales calls through lead
            generation.
          </p>
        </div>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <label className="block font-semibold">
            Name <span className="text-mk-accent">*</span>
            <input
              required
              name="name"
              autoComplete="name"
              placeholder="John Doe"
              className={inputClass}
            />
          </label>

          <label className="block font-semibold">
            Phone number <span className="text-mk-accent">*</span>
            <input
              required
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Phone number"
              className={inputClass}
            />
          </label>

          <label className="block font-semibold">
            Email <span className="text-mk-accent">*</span>
            <input
              required
              name="email"
              type="email"
              autoComplete="email"
              placeholder="johnsmith@example.com"
              className={inputClass}
            />
          </label>

          <button
            type="submit"
            className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-mk-accent text-base font-semibold text-white transition-colors hover:bg-mk-accent/90"
          >
            Let&rsquo;s Talk <ArrowRight />
          </button>

          {submitted && (
            <p className="text-sm text-white/80">
              Form not connected yet &mdash; this is a prototype. No data was
              sent.
            </p>
          )}
        </form>
      </div>

      <div className="border-t border-white/15 px-6 py-7 text-center text-sm text-white/55">
        &copy; {new Date().getFullYear()} Market Better Studio. Content
        Funnels&trade; is a trademark of Market Better Studio.
      </div>
    </footer>
  );
}
