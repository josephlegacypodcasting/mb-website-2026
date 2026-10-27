import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works | Market Better",
  description:
    "Video, content, inbound, and outbound as one continuous funnel: awareness at the top, nurture in the middle, the booked meeting at the bottom.",
};

const FUNNEL_STEPS = [
  {
    number: "01",
    title: "Video",
    stage: "Top of funnel",
    color: "bg-mk-accent",
    description:
      "Pure awareness and authority. YouTube, podcast, and educational content is how strangers discover you and start trusting you before they have any buying intent.",
  },
  {
    number: "02",
    title: "Content",
    stage: "Top \u2192 middle",
    color: "bg-mk-accent",
    description:
      "Social and short-form drive top-funnel reach and repetition; long-form written, newsletters, blogs, nurtures people who already know you and keeps you top of mind.",
  },
  {
    number: "03",
    title: "Inbound",
    stage: "Middle \u2192 bottom",
    color: "bg-mk-primary",
    description:
      "Lead magnets convert an anonymous audience into known contacts; email campaigns nurture those contacts toward the booked call where it hands off to the bottom.",
  },
  {
    number: "04",
    title: "Outbound",
    stage: "Bottom of funnel",
    color: "bg-mk-fg",
    description:
      "Targeted email straight at your ICP with one goal: a sales conversation. It skips awareness entirely and goes for the meeting.",
  },
];

const SYSTEM = [
  {
    number: "01",
    title: "Video",
    description:
      "It's time to step in front of your competition and differentiate yourself in a crowded market.",
    think: "YouTube, podcast, educational, and sales videos.",
  },
  {
    number: "02",
    title: "Content",
    description:
      "Amplify one conversation everywhere. Fuel the flywheel and own your category.",
    think: "Social media, blogs, newsletters, and sales collateral.",
  },
  {
    number: "03",
    title: "Inbound",
    description:
      "Turn an engaged audience into qualified leads your sales team actually wants.",
    think: "Inbound lead magnets that feed email campaigns to book sales calls.",
  },
  {
    number: "04",
    title: "Outbound",
    description:
      "Email marketing that directly targets your ICP to drive interest and sales calls.",
    think: "Outsourced sales engine that's working while you're asleep.",
  },
];

export default function HowItWorksPage() {
  return (
    <main>
      <section className="px-6 py-20 md:px-12 md:py-28 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <p className="mk-kicker">The funnel</p>
          <h1 className="font-display text-5xl font-semibold uppercase leading-[.96] md:text-7xl">
            One funnel. <span className="text-mk-accent">Four steps.</span>
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-relaxed">
            Each step lives at a different depth of the funnel: awareness at the
            top, nurture in the middle, the booked meeting at the bottom.
            Together they form one continuous flow from stranger to sales call.
          </p>

          <div className="mt-16 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            {/* The funnel diagram: three clipped bands stacked into a triangle. */}
            <div className="w-full">
              <div className="relative aspect-square w-full">
                <div className="absolute inset-x-0 top-0 flex h-[30%] items-center justify-center bg-mk-accent text-white [clip-path:polygon(0_0,100%_0,85%_100%,15%_100%)]">
                  <div className="-translate-y-3 text-center">
                    <p className="font-display text-2xl font-bold uppercase md:text-3xl">
                      Top
                    </p>
                    <p className="text-sm md:text-base">Awareness + Trust</p>
                  </div>
                </div>
                <div className="absolute inset-x-0 top-[30%] flex h-[30%] items-center justify-center bg-mk-primary text-white [clip-path:polygon(15%_0,85%_0,70%_100%,30%_100%)]">
                  <div className="-translate-y-1 text-center">
                    <p className="font-display text-xl font-bold uppercase md:text-2xl">
                      Middle
                    </p>
                    <p className="text-xs md:text-sm">Qualify + Nurture</p>
                  </div>
                </div>
                <div className="absolute inset-x-0 top-[60%] flex h-[40%] items-start justify-center bg-mk-fg text-mk-bg [clip-path:polygon(30%_0,70%_0,50%_100%)]">
                  <div className="pt-8 text-center md:pt-10">
                    <p className="font-display text-lg font-bold uppercase md:text-xl">
                      Bottom
                    </p>
                    <p className="text-xs md:text-sm">Target + Book</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div
                className="absolute bottom-10 left-5 top-6 w-px bg-mk-border"
                aria-hidden="true"
              />
              <ol className="space-y-9">
                {FUNNEL_STEPS.map((step) => (
                  <li
                    key={step.number}
                    className="relative grid grid-cols-[2.75rem_1fr] gap-5"
                  >
                    <span
                      className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold text-white ${step.color}`}
                    >
                      {step.number}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-baseline gap-x-4">
                        <h2 className="font-display text-[1.7rem] font-semibold md:text-3xl">
                          {step.title}
                        </h2>
                        <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-mk-accent">
                          {step.stage}
                        </p>
                      </div>
                      <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-mk-muted-fg">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-mk-primary px-6 py-20 text-white md:px-12 md:py-28 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-5xl font-semibold uppercase leading-[.96] md:text-7xl">
            The <span className="text-mk-accent">content funnel</span> system.
          </h2>
          <p className="mt-8 max-w-4xl text-xl leading-relaxed text-white/90">
            One compounding engine that turns a single conversation into reach,
            pipeline, and revenue. Four connected stages, with marketing and
            sales working as one system instead of two disconnected teams.
          </p>

          <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-white/20">
            {SYSTEM.map((item, index) => (
              <div
                key={item.number}
                className={index > 0 ? "lg:pl-10" : "lg:pr-10"}
              >
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-mk-accent">
                  {item.number}
                </p>
                <h3 className="mt-5 font-display text-3xl font-semibold md:text-4xl">
                  {item.title}
                </h3>
                <p className="mt-4 leading-relaxed text-white/80">
                  {item.description}
                </p>
                <div className="mt-10">
                  <div className="h-px w-12 bg-mk-accent" aria-hidden="true" />
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-mk-accent">
                    Think
                  </p>
                  <p className="mt-3 leading-relaxed text-white/80">
                    {item.think}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
