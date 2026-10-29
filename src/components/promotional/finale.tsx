"use client";

import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import { EASE, Magnetic, Reveal } from "@/components/promotional/motion";
import { useReducedMotion } from "@/components/promotional/use-reduced-motion";

export function Finale() {
  const reduce = useReducedMotion();

  return (
    <motion.section
      id="contact"
      initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.1, ease: EASE }}
      className="scroll-mt-28 bg-primary py-20 text-primary-foreground lg:py-24"
    >
      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-10 px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div>
          <Reveal>
            <h2 className="text-[clamp(2rem,3.6vw,2.9rem)] font-extrabold tracking-[-0.02em]">
              Ready when you are.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-4 max-w-[48ch] text-[16px] leading-[1.65] opacity-80">
              One call. We migrate your records, train your staff, and stay until the system runs itself.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-8 flex flex-col gap-3.5 text-[15px] font-semibold sm:flex-row sm:gap-10">
              <a href="tel:+97714220000" className="flex items-center gap-2.5 transition-opacity hover:opacity-75">
                <Phone className="size-[18px]" /> +977 1 4220000
              </a>
              <a
                href="mailto:contact@baudhika.edu.np"
                className="flex items-center gap-2.5 transition-opacity hover:opacity-75"
              >
                <Mail className="size-[18px]" /> contact@baudhika.edu.np
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="lg:justify-self-end">
          <Magnetic>
            <a
              href="mailto:contact@baudhika.edu.np"
              className="group relative inline-flex h-[54px] items-center overflow-hidden rounded-[10px] bg-primary-foreground px-10 text-[15.5px] font-bold text-primary transition-transform duration-300 hover:-translate-y-0.5"
            >
              Get started
              <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-primary/15 transition-[left] duration-700 group-hover:left-[130%]" />
            </a>
          </Magnetic>
        </Reveal>
      </div>
    </motion.section>
  );
}
