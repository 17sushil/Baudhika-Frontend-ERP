"use client";

import { motion } from "framer-motion";
import { EASE, Magnetic, Reveal } from "@/components/promotional/motion";
import { useReducedMotion } from "@/components/promotional/use-reduced-motion";

const PAINS = ["Paper registers", "Excel sheets", "Cash receipts", "Manual payroll"];

export function PaperBand() {
  const reduce = useReducedMotion();

  return (
    <motion.section
      initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.1, ease: EASE }}
      className="bg-[#0f2433] py-20 text-white lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1280px] px-6 text-center lg:px-8">
        <Reveal>
          <h2 className="text-[clamp(1.8rem,3.2vw,2.4rem)] font-extrabold tracking-[-0.02em]">
            Still running on paper and spreadsheets?
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mx-auto mt-4 max-w-[52ch] text-[15.5px] leading-[1.65] text-white/65">
            See what changes when every desk works from one reconciled record.
          </p>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            {PAINS.map((pain) => (
              <span
                key={pain}
                className="rounded-full border-[1.5px] border-white/20 px-6 py-3 text-[14px] font-bold text-white/85"
              >
                {pain}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.18} className="mt-10">
          <Magnetic>
            <a
              href="#contact"
              className="inline-flex h-[52px] items-center rounded-[10px] bg-white px-10 text-[15px] font-bold text-[#0f2433] transition-all duration-300 hover:-translate-y-0.5 hover:bg-highlight hover:text-[#231400]"
            >
              See the system
            </a>
          </Magnetic>
        </Reveal>
      </div>
    </motion.section>
  );
}
