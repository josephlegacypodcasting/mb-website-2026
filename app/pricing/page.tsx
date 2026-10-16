import { Check, ArrowRight } from "@/components/icons";

const ENGINE = [
  {
    number: "01",
    title: "Content Engine",
    description:
      "Video, social, blog, and inbound running as one conversation, so your market keeps hearing from you and remembers why.",
    youGet: [
      "YouTube, podcast, and educational video",
      "Social, blog, and newsletter that keep the conversation going",
      "Inbound that turns attention into contacts",
    ],
  },
  {
    number: "02",
    title: "Lead Generation Engine",
    description:
      "Email, LinkedIn, and phone pointed at the same list of ideal buyers, so nothing that warms up gets left alone.",
    youGet: [
      "Email and LinkedIn outreach to your exact ideal buyer",
      "Phone follow up on the people already showing interest",
      "Booked sales appointments on your calendar",
    ],
  },
  {
    number: "03",
    title: "Data Dashboard",
    description:
      "Content and lead generation pulled into one platform, so you see the whole picture instead of three separate reports.",
    youGet: [
      "One view of content performance, leads, and pipeline",
      "Cost per booked appointment, always visible",
      "Proof of what your monthly spend returned",
    ],
  },
];

const OPTIONS = [
  {
    kicker: "Option 01",
    name: "Pay Per Call",
    price: 4900,
    plus: "$600 per booked appointment",
    description: "Scale your booked appointments up or down, month by month.",
    bullets: [
      "Only pay for appointments that land on your calendar",
      "Turn the volume up or down whenever you need",
      "One engine fee plus the appointments you actually book",
    ],
    featured: true,
  },
  {
    kicker: "Option 02",
    name: "Flat Fee",
    price: 7500,
    plus: "One flat price. Everything included.",
    description: "One predictable number every month. No variables.",
    bullets: [
      "The full engine: content, lead generation, and the data dashboard",
      "No per-appointment fees stacked on top",
      "The simplest budget line in marketing",
    ],
    featured: false,
  },
];

const money = (value: number) => `$${value.toLocaleString("en-US")}`;

export default function PricingPage() {
  return (
    <main>
      <section className="px-6 pt-16 pb-14 md:px-12 md:pt-24 md:pb-16 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <p className="mk-kicker mb-0 text-sm sm:text-lg">Pricing</p>
          <h1 className="font-display text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.5rem]">
            One Engine.
            <br />
            <span className="text-mk-accent">Pay For Performance</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-mk-muted-fg md:text-xl">
            Content Marketing builds the audience.
            <br />
            Lead Generation turns it into pipeline.
          </p>
        </div>
      </section>

      <section className="bg-mk-primary px-6 py-20 text-white md:px-12 md:py-28 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-5xl font-semibold uppercase leading-[.96] md:text-6xl">
            The <span className="text-mk-accent">engine.</span> What you get.
          </h2>
          <p className="mt-8 max-w-4xl text-lg leading-relaxed text-white/90 md:text-xl">
            Every option below runs the same three-part engine. Here is exactly
            what each part delivers.
          </p>

          <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-white/20">
            {ENGINE.map((part, index) => (
              <div
                key={part.number}
                className={`flex flex-col ${
                  index === 0
                    ? "lg:pr-10"
                    : index === ENGINE.length - 1
                      ? "lg:pl-10"
                      : "lg:px-10"
                }`}
              >
                <div className="lg:min-h-[15rem]">
                  <p className="text-sm font-bold uppercase tracking-[0.12em] text-mk-accent">
                    {part.number}
                  </p>
                  <h3 className="mt-5 font-display text-3xl font-semibold leading-[1.1] md:text-[2.15rem]">
                    {part.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-white/80">
                    {part.description}
                  </p>
                </div>
                <div className="mt-8">
                  <div className="h-px w-12 bg-mk-accent" aria-hidden="true" />
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-mk-accent">
                    You get
                  </p>
                  <ul className="mt-3 space-y-2">
                    {part.youGet.map((line) => (
                      <li
                        key={line}
                        className="flex items-start gap-2 text-sm leading-relaxed text-white/85"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-mk-accent" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 pb-24 md:px-12 md:py-28 md:pb-32 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-5xl font-semibold uppercase leading-[.96] md:text-6xl">
            Two ways <span className="text-mk-accent">to pay.</span>
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-mk-muted-fg md:text-xl">
            Same engine behind both. The only difference is how Market Better
            gets paid.
          </p>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {OPTIONS.map((option) => (
              <article
                key={option.kicker}
                className={`flex flex-col rounded-[2rem] p-8 shadow-soft sm:p-10 ${
                  option.featured
                    ? "bg-mk-panel-ink text-white shadow-panel"
                    : "border border-mk-peach bg-mk-card"
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-mk-accent">
                  {option.kicker}
                </p>
                <h3 className="mt-4 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {option.name}
                </h3>

                <div className="mt-6 flex items-baseline gap-2">
                  <span
                    className={`font-display text-5xl font-extrabold tracking-tight ${
                      option.featured ? "" : "text-mk-accent"
                    }`}
                  >
                    {money(option.price)}
                  </span>
                  <span
                    className={`font-medium ${
                      option.featured ? "text-white/70" : "text-mk-muted-fg"
                    }`}
                  >
                    /month
                  </span>
                </div>

                <p className="mt-2 text-sm font-semibold text-mk-accent">
                  + {option.plus}
                </p>
                <p
                  className={`mt-4 text-sm leading-relaxed ${
                    option.featured ? "text-white/80" : "text-mk-muted-fg"
                  }`}
                >
                  {option.description}
                </p>

                <ul
                  className={`mt-8 space-y-3 border-t pt-8 ${
                    option.featured ? "border-white/10" : "border-mk-peach"
                  }`}
                >
                  {option.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className={`flex items-start gap-3 text-sm leading-relaxed ${
                        option.featured ? "text-white/90" : "text-mk-fg/85"
                      }`}
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mk-accent/15">
                        <Check
                          className="h-3.5 w-3.5 text-mk-accent"
                          strokeWidth={4}
                        />
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`mt-10 flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-lg font-bold transition-transform duration-200 hover:scale-[1.02] active:scale-95 ${
                    option.featured
                      ? "bg-mk-accent text-white"
                      : "bg-mk-accent/10 hover:bg-mk-accent hover:text-white"
                  }`}
                >
                  Let&rsquo;s Talk <ArrowRight className="h-5 w-5" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
