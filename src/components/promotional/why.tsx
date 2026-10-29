"use client";

import { Magnetic, Reveal } from "@/components/promotional/motion";

export function Why() {
  return (
    <section id="why" className="scroll-mt-28 py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-8">
        <div className="mx-auto max-w-[780px] text-center">
          <Reveal>
            <h2 className="text-[clamp(1.8rem,3.2vw,2.5rem)] font-extrabold tracking-[-0.02em]">
              Why Baudhika School Management Software?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-[15.5px] leading-[1.75] text-muted-foreground">
              Baudhika is the multipurpose system that automates your institution&apos;s daily operations and
              keeps one reconciled record — so management sees the truth, not three versions of it. From
              admissions to fee collection to payroll, every process runs smoothly in a single web-based
              platform.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-4 text-[15.5px] leading-[1.75] text-muted-foreground">
              Built for the way institutions in Nepal actually work: your registers, your fee heads, your
              reports — migrated, configured, and live in seven days.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mt-12">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[12px] bg-highlight p-8 sm:p-10 lg:flex-row lg:items-center">
            <div>
              <b className="block text-[20px] font-extrabold tracking-[-0.01em] text-[#231400]">
                Want to see how Baudhika simplifies daily operations?
              </b>
              <p className="mt-2 max-w-[60ch] text-[14.5px] leading-[1.65] text-[#4a3200]">
                One call. We walk through your departments and show you the system on your own numbers.
              </p>
            </div>
            <Magnetic strength={8} className="shrink-0">
              <a
                href="#contact"
                className="inline-flex h-[48px] items-center rounded-[10px] bg-[#231400] px-8 text-[14.5px] font-bold text-white transition-transform duration-300 hover:-translate-y-0.5"
              >
                Talk to us
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
