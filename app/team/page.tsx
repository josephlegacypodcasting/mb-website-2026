import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight } from "@/components/icons";
import { TEAM, teamPhoto } from "@/lib/team";

export const metadata: Metadata = {
  title: "The Team | Market Better",
  description:
    "The people who run the Market Better engine — content, lead generation, and the data behind both.",
};

export default function Team() {
  return (
    <main>
      <section className="px-6 pt-16 pb-14 md:px-12 md:pt-24 md:pb-16 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <p className="mk-kicker mb-0 text-sm sm:text-lg">The Team</p>
          <h1 className="font-display text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.5rem]">
            One engine.
            <br />
            <span className="text-mk-accent">One team behind it</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-mk-muted-fg md:text-xl">
            Strategists, producers, writers, and sellers working the same
            system.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20 md:px-12 md:pb-28 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <ul className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
            {TEAM.map((member) => (
              <li key={member.slug}>
                {/* The portraits are all 4:5 on a neutral background, so a
                    fixed aspect box keeps the grid on one baseline. */}
                <div className="group relative aspect-[4/5] overflow-hidden rounded-mk bg-mk-muted">
                  <Image
                    src={teamPhoto(member)}
                    alt={member.name}
                    width={800}
                    height={1000}
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-4">
                  <div className="h-px w-8 bg-mk-accent" aria-hidden="true" />
                  <p className="mt-3 font-display text-lg font-bold leading-tight tracking-tight sm:text-xl">
                    {member.name}
                  </p>
                  {member.role ? (
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-mk-muted-fg">
                      {member.role}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-mk-primary px-6 py-20 text-white md:px-12 md:py-24 lg:px-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="max-w-3xl font-display text-4xl font-semibold uppercase leading-[.98] md:text-6xl">
              Want this team on
              <br />
              <span className="text-mk-accent">your pipeline?</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
              The same people you just met run the content engine, the lead
              generation engine, and the dashboard that ties them together.
            </p>
          </div>

          <a
            href="#contact"
            className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-2xl bg-mk-accent px-8 text-lg font-bold text-white transition-transform duration-200 hover:scale-[1.02] active:scale-95"
          >
            Let&rsquo;s Talk <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>
    </main>
  );
}
