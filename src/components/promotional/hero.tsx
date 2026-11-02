"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Counter, EASE, Magnetic, SplitText } from "@/components/promotional/motion";
import { useReducedMotion } from "@/components/promotional/use-reduced-motion";

const STATS = [
  { to: 240, suffix: "+", decimals: 0, label: "Institutions live" },
  { to: 310, suffix: "k", decimals: 0, label: "Records daily" },
  { to: 98.6, suffix: "%", decimals: 1, label: "Billing accuracy" },
  { to: 7, suffix: " days", decimals: 0, label: "First call to live" },
];

export function Hero() {
  const reduce = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: gridRef, offset: ["start start", "end start"] });
  const driftRaw = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const drift = useSpring(driftRaw, { stiffness: 90, damping: 26 });

  return (
    <section id="top" className="relative overflow-hidden">
      <motion.div
        ref={gridRef}
        style={reduce ? undefined : { y: drift }}
        className="mx-auto w-full max-w-[1280px] px-6 pb-16 pt-14 text-center lg:px-8 lg:pb-20 lg:pt-20"
      >
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-6 flex items-center justify-center gap-3 text-[12px] font-bold tracking-[0.24em] text-tertiary"
        >
          <span className="block h-[2px] w-9 bg-highlight" />
          ALL-IN-ONE ERP
          <span className="block h-[2px] w-9 bg-highlight" />
        </motion.p>

        <SplitText
          as="h1"
          delay={0.15}
          text="School & College Management Software"
          className="mx-auto max-w-[18ch] text-[clamp(2.5rem,5.2vw,4.2rem)] font-extrabold leading-[1.05] tracking-[-0.03em]"
        />

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
          className="mx-auto mt-6 max-w-[56ch] text-[18px] leading-[1.65] text-muted-foreground"
        >
          <b className="font-semibold text-foreground">Automate daily operations. Reconcile every record.</b>{" "}
          Baudhika carries your institution&apos;s academic and administrative work in one place.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <Magnetic>
            <a
              href="#contact"
              className="group relative inline-flex h-[52px] items-center overflow-hidden rounded-[10px] bg-primary px-9 text-[15.5px] font-semibold text-primary-foreground shadow-[0_10px_28px_-10px_var(--primary)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Get started
              <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/25 transition-[left] duration-700 group-hover:left-[130%]" />
            </a>
          </Magnetic>

          <a
            href="#contact"
            className="inline-flex h-[52px] items-center rounded-[10px] border-[1.5px] border-primary px-9 text-[15.5px] font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Contact us
          </a>
        </motion.div>

        <div className="mx-auto mt-14 grid max-w-[760px] grid-cols-2 gap-y-10 sm:grid-cols-4 sm:divide-x sm:divide-border">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={reduce ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.85 + index * 0.1, ease: EASE }}
              className="px-6"
            >
              <Counter
                to={stat.to}
                suffix={stat.suffix}
                decimals={stat.decimals}
                className="block text-[30px] font-extrabold tabular-nums tracking-[-0.02em] text-primary"
              />
              <span className="mt-1.5 block text-[12.5px] font-semibold text-muted-foreground">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
