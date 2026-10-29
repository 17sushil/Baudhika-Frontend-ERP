import Link from "next/link";

const SYSTEM = [
  { href: "#why", label: "Why us" },
  { href: "#system", label: "The system" },
  { href: "#stories", label: "Stories" },
  { href: "#faq", label: "FAQ" },
];

export function PromoFooter() {
  return (
    <footer className="bg-[#0f2433] text-[13.5px] text-[#8aa3b5]">
      <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-6 pb-12 pt-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <b className="text-[15px] font-bold tracking-[-0.01em] text-white">BAUDHIKA</b>
            <span className="rounded bg-highlight px-1.5 py-0.5 text-[9px] font-bold tracking-[0.1em] text-[#231400]">
              ERP
            </span>
          </div>
          <p className="mt-4 max-w-[32ch] leading-[1.7]">
            School management, properly built. One reconciled system for admissions, billing, payroll and
            records.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-[12px] font-bold tracking-[0.14em] text-white">SYSTEM</h4>
          {SYSTEM.map((link) => (
            <a key={link.href} href={link.href} className="mb-2.5 block transition-colors hover:text-white">
              {link.label}
            </a>
          ))}
        </div>

        <div>
          <h4 className="mb-4 text-[12px] font-bold tracking-[0.14em] text-white">ACCOUNT</h4>
          <Link href="/login" className="mb-2.5 block transition-colors hover:text-white">
            Sign in
          </Link>
          <a href="#contact" className="mb-2.5 block transition-colors hover:text-white">
            Get started
          </a>
          <a href="#contact" className="mb-2.5 block transition-colors hover:text-white">
            Contact us
          </a>
        </div>

        <div>
          <h4 className="mb-4 text-[12px] font-bold tracking-[0.14em] text-white">CONTACT</h4>
          <a href="tel:+97714220000" className="mb-2.5 block transition-colors hover:text-white">
            +977 1 4220000
          </a>
          <a href="mailto:contact@baudhika.edu.np" className="mb-2.5 block transition-colors hover:text-white">
            contact@baudhika.edu.np
          </a>
          <p>Kathmandu, Nepal</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-2 px-6 py-5 text-[12.5px] sm:flex-row sm:justify-between lg:px-8">
          <span>© 2026 Baudhika ERP</span>
          <span>Babar Mahal, Kathmandu, Bagmati Province</span>
        </div>
      </div>
    </footer>
  );
}
