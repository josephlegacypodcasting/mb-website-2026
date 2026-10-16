import { Quote } from "./icons";

/*
 * Lovable ships avatar and client-logo images with this section. We do not have
 * those assets, so the cards render the attribution as text. Dropping in the
 * images later is a one-line change per card.
 */
const TESTIMONIALS = [
  {
    quote:
      "When we started this process about six months ago, we were at a run rate of about $7 million. And now, we are at a run rate of $12 million.",
    name: "Daniel Rosen",
    title: "Founder, Credit Repair Cloud",
    company: "Credit Repair Cloud",
  },
  {
    quote:
      "The investment into our content system has already closed $250k in 90 days and we're just getting started.",
    name: "Kevin Clayson",
    title: "DFY Investing",
    company: "DFY Real Estate",
  },
  {
    quote:
      "Our number of lead inquiries went up 55% in the first month, then another 65% the month after that. So definitely a major jump!",
    name: "Dr. Joy Kong",
    title: "Founder, AAICT",
    company: "American Academy of Integrative Cell Therapy",
  },
];

export function Testimonials() {
  return (
    <section className="bg-mk-primary py-20 text-white md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        <h2 className="mb-14 text-center font-display text-4xl font-semibold md:text-6xl">
          Results That Speak for Themselves
          <span className="text-mk-accent">.</span>
        </h2>

        <div className="grid gap-6 md:grid-cols-3 md:items-stretch">
          {TESTIMONIALS.map((item) => (
            <article
              key={item.name}
              className="flex min-h-[26rem] flex-col rounded-mk bg-mk-bg p-6 text-mk-fg md:p-7"
            >
              <Quote className="mb-4 h-7 w-7 text-mk-accent" />
              <p className="mb-6 flex-1 font-display text-lg font-medium leading-snug lg:text-xl">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-sm text-mk-muted-fg">{item.title}</p>
              </div>
              <p className="mt-auto pt-4 font-display text-sm font-bold uppercase tracking-[0.12em] text-mk-primary">
                {item.company}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
