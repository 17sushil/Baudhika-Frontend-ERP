"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, Magnetic, Reveal } from "@/components/promotional/motion";
import { useReducedMotion } from "@/components/promotional/use-reduced-motion";

const SEGMENTS = [
  { label: "Schools", line: "Admissions to report cards — one record from playgroup to Grade 12." },
  { label: "Colleges", line: "Batches, faculties and exams reconciled across every program." },
  { label: "+2 Colleges", line: "Science, management, humanities — streams, sections and sessions in one place." },
  { label: "Training institutes", line: "Courses, intakes and certificates tracked intake to intake." },
];

export function Configurator() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  return (
    <section className="border-b border-border py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1280px] px-6 text-center lg:px-8">
        <Reveal>
          <h2 className="text-[clamp(1.8rem,3.2vw,2.4rem)] font-extrabold tracking-[-0.02em]">
            Shape it around your institution
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-4 text-[15.5px] text-muted-foreground">
            One platform, configured for the way your institution actually works.
          </p>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            {SEGMENTS.map((segment, index) => {
              const isActive = index === active;
              return (
                <button
                  key={segment.label}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-pressed={isActive}
                  className={`relative rounded-full px-6 py-3 text-[14px] font-bold transition-colors ${
                    isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="segment-pill"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                      className="absolute inset-0 rounded-full bg-primary"
                    />
                  )}
                  {!isActive && (
                    <span className="absolute inset-0 rounded-full border-[1.5px] border-border bg-card" />
                  )}
                  <span className="relative">{segment.label}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-8 min-h-[56px]">
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -14 }}
              transition={{ duration: 0.38, ease: EASE }}
              className="mx-auto max-w-[52ch] text-[17px] font-medium leading-[1.6]"
            >
              {SEGMENTS[active].line}
            </motion.p>
          </AnimatePresence>
        </div>

        <Reveal delay={0.1} className="mt-6">
          <Magnetic>
            <a
              href="#contact"
              className="inline-flex h-[50px] items-center rounded-[10px] bg-primary px-9 text-[15px] font-semibold text-primary-foreground shadow-[0_10px_28px_-10px_var(--primary)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Get started
            </a>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
