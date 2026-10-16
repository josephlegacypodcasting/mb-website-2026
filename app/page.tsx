import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { Testimonials } from "@/components/testimonials";

const PROBLEMS = [
  {
    label: "Message",
    title: "You don\u2019t stand out",
    points: [
      "Your buyers are looking. You\u2019re nowhere to be found.",
      "Your content is missing or saying nothing new.",
      "Sales starts from zero on every single call.",
    ],
  },
  {
    label: "Revenue",
    title: "You can\u2019t see the ROI",
    points: [
      "Lots of activity. No clear path to ROI.",
      "Marketing and sales are not a unified system.",
      "Content exists. Your pipeline isn\u2019t growing.",
    ],
  },
];

const STEPS = [
  {
    number: "01",
    title: "Video",
    description:
      "Expert-led video builds awareness, authority, and trust before a buyer is ready to talk.",
  },
  {
    number: "02",
    title: "Content",
    description:
      "One conversation becomes social, newsletters, blogs, and sales content across every buyer channel.",
  },
  {
    number: "03",
    title: "Inbound",
    description:
      "Lead magnets and nurture turn engaged audiences into qualified opportunities for your sales team.",
  },
  {
    number: "04",
    title: "Outbound",
    description:
      "Targeted outreach puts your message in front of the right ICP and books the sales conversation.",
  },
];

const VANITY = ["Awareness", "Impressions", "Followers"];
const REAL = ["Booked sales meetings", "Pipeline created", "Closed revenue"];

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[680px] border-b border-mk-fg/15 px-6 py-20 md:px-12 md:py-28 lg:px-20">
        <div className="mx-auto flex min-h-[500px] max-w-7xl flex-col justify-between">
          <div className="max-w-5xl">
            <h1 className="font-display text-6xl font-semibold uppercase leading-[.94] sm:text-7xl md:text-8xl lg:text-9xl">
              One system.
              <br />
              <span className="text-mk-accent">Marketing + Sales.</span>
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-relaxed md:text-xl">
              Market Better fuses marketing and sales into one system: a
              video-first content engine built around your ICP, so every video,
              post, and email pulls the exact buyer you want closer to a sales
              conversation.
            </p>
          </div>
        </div>
      </section>

      {/* Two problems */}
      <section
        id="problem"
        className="scroll-mt-28 bg-mk-primary px-6 py-24 text-white md:px-12 md:py-32 lg:px-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="font-display text-5xl font-semibold leading-[1.02] md:text-7xl">
              Two problems.
              <br />
              Same root cause<span className="text-mk-accent">.</span>
            </h2>
            <p className="mx-auto mt-7 text-lg text-white/80 lg:whitespace-nowrap">
              Every company wants two things: a clear, differentiated message
              and a path to more revenue.
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2">
            {PROBLEMS.map((problem) => (
              <article
                key={problem.label}
                className="rounded-mk bg-mk-bg p-7 text-mk-fg md:p-10"
              >
                <span className="inline-block rounded-[0.125rem] bg-mk-accent px-3 py-1 text-xs font-bold uppercase text-white">
                  {problem.label}
                </span>
                <h3 className="mt-6 max-w-lg font-display text-4xl font-semibold leading-tight md:text-5xl">
                  {problem.title}
                </h3>
                <ul className="mt-7 space-y-2 text-lg leading-relaxed">
                  {problem.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span aria-hidden="true">&bull;</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <p className="mt-14 text-center font-display text-2xl md:text-3xl lg:whitespace-nowrap">
            Most companies treat these as separate problems.{" "}
            <span className="text-mk-accent">They&rsquo;re not.</span>
          </p>
        </div>
      </section>

      {/* The Content Funnel System */}
      <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="border-b border-mk-fg/20 pb-8">
            <h2 className="max-w-5xl font-display text-5xl font-semibold uppercase leading-none md:text-7xl">
              The <span className="text-mk-accent">Content Funnel</span> System.
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-mk-muted-fg">
              One compounding engine turns a single conversation into reach,
              pipeline, and revenue, with marketing and sales working as one
              system.
            </p>
          </div>

          <div className="grid md:grid-cols-4">
            {STEPS.map((step) => (
              <article
                key={step.number}
                className="border-b border-mk-fg/20 py-10 md:border-b-0 md:border-r md:border-mk-fg/20 md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
              >
                <span className="font-display text-sm font-bold text-mk-accent">
                  {step.number}
                </span>
                <h3 className="mt-8 font-display text-3xl font-semibold">
                  {step.title}
                </h3>
                <p className="mt-4 leading-relaxed text-mk-muted-fg">
                  {step.description}
                </p>
              </article>
            ))}
          </div>

          <Link
            href="/how-it-works"
            className="mt-10 inline-flex h-11 items-center justify-center gap-2 rounded-mk border border-mk-fg px-8 text-sm font-semibold transition-colors hover:bg-mk-fg hover:text-mk-bg"
          >
            See how the funnel works <ArrowRight />
          </Link>
        </div>
      </section>

      {/* Judged by meetings booked */}
      <section className="bg-mk-primary px-6 py-24 text-center text-white md:px-12 md:py-32 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mx-auto max-w-6xl font-display text-4xl font-semibold uppercase leading-[1.05] md:text-5xl lg:text-[4rem]">
            We&rsquo;re judged by{" "}
            <span className="text-mk-accent">meetings booked.</span> Not{" "}
            <span className="text-mk-secondary line-through">clicks</span> or{" "}
            <span className="text-mk-secondary line-through">
              vanity metrics.
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-white/80">
            Marketing&rsquo;s job is simple: soften and accelerate the sales
            cycle. Make buyers warm before the first call. Put the right person
            on your sales team&rsquo;s calendar, already nodding before they
            pick up.
          </p>

          <div className="mt-16 flex flex-wrap justify-center gap-3 text-xs font-bold uppercase">
            {VANITY.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/30 px-4 py-2 text-white/45 line-through"
              >
                {item}
              </span>
            ))}
            {/* Lovable forces these three onto one line at every width, which
                overflows to 452px inside a 375px viewport — clipped, not
                scrollable, so the last pill is simply lost. Kept on one line
                from lg up, where that was the intent and there's room. */}
            <span className="flex flex-wrap justify-center gap-3 lg:flex-nowrap lg:whitespace-nowrap">
              {REAL.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-mk-accent px-4 py-2 text-white"
                >
                  &rarr; {item}
                </span>
              ))}
            </span>
          </div>
        </div>
      </section>

      <Testimonials />
    </main>
  );
}
