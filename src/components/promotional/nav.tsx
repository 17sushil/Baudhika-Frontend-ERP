"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Menu, Phone, X } from "lucide-react";
import { Magnetic } from "@/components/promotional/motion";
import { ThemeToggle } from "@/components/promotional/theme-toggle";
import { useReducedMotion } from "@/components/promotional/use-reduced-motion";

const LINKS = [
  { href: "#why", label: "Why us" },
  { href: "#system", label: "System" },
  { href: "#stories", label: "Stories" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export function PromoNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="bg-[#0f2433] text-[12px] text-white/80">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-6 py-2 lg:px-8">
          <p className="flex items-center gap-2">
            <motion.i
              className="block size-1.5 rounded-full bg-highlight"
              animate={reduce ? undefined : { opacity: [1, 0.35, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <span>
              Admissions open for 2083 — <b className="font-semibold text-white">go live in 7 days.</b>
            </span>
          </p>
          <div className="hidden items-center gap-5 md:flex">
            <a href="tel:+97714220000" className="flex items-center gap-1.5 transition-colors hover:text-white">
              <Phone className="size-3.5" /> +977 1 4220000
            </a>
            <a
              href="mailto:contact@baudhika.edu.np"
              className="flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <Mail className="size-3.5" /> contact@baudhika.edu.np
            </a>
            <Link href="/login" className="font-semibold text-white hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-[100] transition-all duration-300 ${
          scrolled
            ? "border-b border-border bg-background/85 backdrop-blur-xl"
            : "border-b border-transparent bg-background"
        }`}
      >
        <div
          className={`mx-auto flex w-full max-w-[1280px] items-center gap-6 px-6 transition-all duration-300 lg:px-8 ${
            scrolled ? "h-[60px]" : "h-[72px]"
          }`}
        >
          <a href="#top" className="flex items-center gap-2 leading-none">
            <b className="text-[17px] font-bold tracking-[-0.01em]">BAUDHIKA</b>
            <span className="rounded bg-highlight px-1.5 py-0.5 text-[9px] font-bold tracking-[0.1em] text-[#231400]">
              ERP
            </span>
          </a>

          <nav className="ml-auto hidden items-center gap-7 lg:flex">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[14px] font-semibold text-foreground/80 transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3 lg:ml-0">
            <Link
              href="/login"
              className="hidden text-[14px] font-semibold text-foreground/80 transition-colors hover:text-primary lg:block"
            >
              Sign in
            </Link>

            <Magnetic strength={8} className="hidden sm:block">
              <a
                href="#contact"
                className="group relative inline-flex h-10 items-center overflow-hidden rounded-[10px] bg-highlight px-5 text-[13.5px] font-semibold text-[#231400] shadow-[0_6px_18px_-8px_rgba(255,167,15,0.95)] transition-colors hover:bg-[#f0990a]"
              >
                Get started
                <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/40 transition-[left] duration-700 group-hover:left-[130%]" />
              </a>
            </Magnetic>

            <ThemeToggle />

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-9 place-items-center rounded-full border border-border text-foreground lg:hidden"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              initial={reduce ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-b border-border bg-background/95 backdrop-blur-xl lg:hidden"
            >
              <div className="flex flex-col gap-1 px-6 py-4">
                {LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-[15px] font-semibold text-foreground/85 transition-colors hover:bg-muted hover:text-primary"
                  >
                    {link.label}
                  </a>
                ))}
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-2.5 text-[15px] font-semibold text-primary"
                >
                  Sign in →
                </Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
