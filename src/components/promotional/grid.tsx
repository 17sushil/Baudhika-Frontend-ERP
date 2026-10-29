"use client";

import { BeamCard, GradientRule } from "@/components/promotional/beam";
import { Reveal } from "@/components/promotional/motion";

const CARDS = [
  {
    title: "Fee collection",
    body: "Collect online or at the counter. Receipts reconcile themselves; defaulters surface on their own.",
    accent: "var(--teal)",
  },
  {
    title: "Admissions",
    body: "Enquiries to enrolment in one pipeline. No lost forms, no duplicate entries, no chaos in Shrawan.",
    accent: "var(--tertiary)",
  },
  {
    title: "Payroll & HR",
    body: "Salaries, deductions and Provident Fund computed and posted — the same figures, every month.",
    accent: "var(--info)",
  },
  {
    title: "Records & reports",
    body: "Board packs, audits and government formats generated from live data — never re-typed.",
    accent: "var(--highlight)",
  },
  {
    title: "Communication",
    body: "Reach parents, staff and students instantly — notices, dues and announcements in one send.",
    accent: "var(--primary)",
  },
  {
    title: "Academic setup",
    body: "Classes, sections, subjects and sessions configured once — everything downstream just follows.",
    accent: "var(--teal)",
  },
];

export function SystemGrid() {
  return (
    <section id="system" className="relative scroll-mt-28 border-y border-border bg-muted/40 py-20 lg:py-24">
      <GradientRule />
      <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-8">
        <div className="mx-auto max-w-[640px] text-center">
          <Reveal>
            <h2 className="text-[clamp(1.8rem,3.2vw,2.5rem)] font-extrabold tracking-[-0.02em]">
              One platform for every department
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-4 text-[15.5px] text-muted-foreground">
              Everything your office runs on — reconciled automatically, visible instantly.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card, index) => (
            <Reveal key={card.title} delay={(index % 3) * 0.08}>
              <BeamCard accent={card.accent} className="h-full transition-transform duration-300 hover:-translate-y-1">
                <div className="flex h-full flex-col p-7">
                  <h3 className="text-[17px] font-extrabold tracking-[-0.01em]">{card.title}</h3>
                  <p className="mt-2.5 flex-1 text-[14px] leading-[1.65] text-muted-foreground">{card.body}</p>
                  <a
                    href="#contact"
                    className="group/lm mt-5 inline-flex items-center gap-1.5 text-[14px] font-bold text-primary transition-colors hover:text-tertiary"
                  >
                    Learn more
                    <span className="inline-block transition-transform duration-300 group-hover/lm:translate-x-1">
                      →
                    </span>
                  </a>
                </div>
              </BeamCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-10 text-center">
          <p className="text-[14.5px] text-muted-foreground">+ everything else your office runs on, under one roof.</p>
          <a
            href="#contact"
            className="mt-5 inline-flex h-[48px] items-center rounded-[10px] border-[1.5px] border-primary px-8 text-[14.5px] font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            See the system
          </a>
        </Reveal>
      </div>
    </section>
  );
}
