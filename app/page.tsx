import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 animated-bg relative overflow-hidden">

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--lime)]/15 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--violet)]/20 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />
      <div className="max-w-md w-full font-sans shadow-2xl rounded-2xl p-8 text-center bg-[var(--surface)]/80 backdrop-blur-xl border border-white/10 relative z-10 overflow-hidden">

        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-44 h-44 bg-gradient-to-b from-[var(--teal)]/30 to-transparent rounded-full blur-2xl pointer-events-none" />
        <h1 className="text-3xl font-extrabold tracking-tight mb-3 text-white">
          <span className="bg-gradient-to-r from-[var(--lime)] via-[var(--teal)] to-[var(--violet)] bg-clip-text text-transparent">
            Student Information
          </span>{" "}
          System
        </h1>

        <p className="text-[var(--muted)] mb-8 text-sm leading-relaxed">
          A modern CRUD management portal built with Next.js App Router, Tailwind CSS, and REST API routing.
        </p>
        <Link
          href="/students"
          className="group relative inline-flex items-center justify-center w-full py-3.5 px-6 rounded-xl font-bold text-slate-950 bg-[var(--lime)] hover:bg-[var(--lime-hover)] transition-all duration-300 shadow-lg shadow-[var(--lime)]/20 hover:shadow-xl hover:shadow-[var(--lime)]/35 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            View Students Dashboard
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </Link>

      </div>
    </main>
  );
}