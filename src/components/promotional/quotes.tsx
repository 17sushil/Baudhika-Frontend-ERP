"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, Reveal } from "@/components/promotional/motion";
import { useReducedMotion } from "@/components/promotional/use-reduced-motion";

const QUOTES = [
  {
    text: "For the first time, our board pack and our bank statement agree. That alone was worth the move.",
    name: "Bijay Sharma",
    role: "Managing Director, Pioneer Higher Secondary College, Kathmandu",
  },
  {
    text: "Fee season used to take my office three weeks. Now the receipts reconcile themselves and I just verify.",
    name: "Principal",
    role: "Secondary School, Pokhara",
  },
  {
    text: "Payroll posts the same day every month and the figures never drift. Our audit finished two weeks early.",
    name: "Accountant",
    role: "+2 College, Chitwan",
  },
];

export function Quotes() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const quote = QUOTES[index];

  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(() => setIndex((value) => (value + 1) % QUOTES.length), 6000);
    return () => clearInterval(id);
  }, [reduce, paused]);

  const go = (direction: number) =>
    setIndex((value) => (value + direction + QUOTES.length) % QUOTES.length);

  return (
    <section
      id="stories"
      className="scroll-mt-28 py-20 lg:py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto w-full max-w-[1280px] px-6 text-center lg:px-8">
        <Reveal>
          <p className="text-[11.5px] font-bold tracking-[0.24em] text-muted-foreground">
            HEAR FROM OUR INSTITUTIONS
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <div aria-hidden className="mt-6 font-[Georgia,serif] text-[84px] leading-[0.5] text-highlight">
            &ldquo;
          </div>
        </Reveal>

        <div className="mt-8 min-h-[220px] sm:min-h-[190px]">
          <AnimatePresence mode="wait">
            <motion.figure
              key={index}
              initial={reduce ? false : { opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -26 }}
              transition={{ duration: 0.5, ease: EASE }}
              drag={reduce ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={(_, info) => {
                if (info.offset.x < -70) go(1);
                else if (info.offset.x > 70) go(-1);
              }}
              className="cursor-grab active:cursor-grabbing"
            >
              <blockquote className="mx-auto max-w-[34ch] text-[clamp(1.45rem,2.8vw,2.1rem)] font-bold leading-[1.4] tracking-[-0.015em]">
                {quote.text}
              </blockquote>
              <figcaption className="mt-7 text-[14px] text-muted-foreground">
                <b className="font-bold text-foreground">{quote.name}</b> — {quote.role}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-center gap-2.5">
          {QUOTES.map((item, i) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show quote ${i + 1}`}
              className="grid h-6 place-items-center"
            >
              <motion.span
                animate={{ width: i === index ? 28 : 8 }}
                transition={{ duration: 0.35, ease: EASE }}
                className={`block h-2 rounded-full ${i === index ? "bg-highlight" : "bg-border"}`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
