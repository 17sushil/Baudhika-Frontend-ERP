"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, Reveal } from "@/components/promotional/motion";

const ITEMS = [
  {
    q: "How long does setup take?",
    a: "Seven days from first call to fully live: we map your departments, migrate your records, configure your workflows, and train your staff on your own data.",
  },
  {
    q: "Do you migrate our existing records?",
    a: "Yes — registers, spreadsheets and legacy files are migrated and verified by our team before go-live. Nothing is re-typed by your staff.",
  },
  {
    q: "Is our data safe?",
    a: "Your data is encrypted end to end, backed up daily, and stays yours — exportable any time you ask. Every entry carries a full audit trail.",
  },
  {
    q: "Do you train our staff?",
    a: "On site, on your own data, until the system runs without us. And support answers in under four hours after that.",
  },
];

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="scroll-mt-28 border-b border-border bg-muted/40 py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-8">
        <Reveal className="text-center">
          <h2 className="text-[clamp(1.8rem,3.2vw,2.5rem)] font-extrabold tracking-[-0.02em]">
            Questions institutions ask us
          </h2>
        </Reveal>

        <div className="mx-auto mt-10 max-w-[760px]">
          {ITEMS.map((item, index) => {
            const isOpen = open === index;
            return (
              <Reveal key={item.q} delay={index * 0.06}>
                <div className="mb-3 overflow-hidden rounded-[10px] border border-border bg-card">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-[15.5px] font-bold"
                  >
                    {item.q}
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-[20px] font-extrabold leading-none text-primary"
                    >
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 text-[14.5px] leading-[1.7] text-muted-foreground">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
