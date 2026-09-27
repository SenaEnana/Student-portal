"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddStudentPage() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Student name cannot be empty.");
      return;
    }
    if (trimmedName.length < 2) {
      setError("Student name must be at least 2 characters long.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName }),
      });

      if (res.ok) {
        router.push("/students?message=Student records created successfully.");
      } else {
        setError("Failed to create student. Please try again.");
      }
    } catch (err) {
      console.error("ERROR:", err);
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center p-4 md:p-6 relative overflow-hidden text-white">
      {/* Background Decorative Glow Orbs */}
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-[var(--lime)]/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-[var(--violet)]/15 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

      {/* Main Glass Card Form */}
      <div className="max-w-lg w-full font-sans shadow-2xl rounded-3xl p-6 md:p-10 bg-[var(--surface)]/80 backdrop-blur-xl border border-white/10 relative z-10 overflow-hidden">
        
        {/* Top Decorative Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-to-b from-[var(--teal)]/25 to-transparent rounded-full blur-2xl pointer-events-none" />

        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
          <span className="bg-gradient-to-r from-[var(--lime)] via-[var(--teal)] to-[var(--violet)] bg-clip-text text-transparent">
            Add New Student
          </span>
        </h1>
        <p className="text-[var(--muted)] text-sm mb-8 leading-relaxed">
          Enter the full name to register a new student profile in the database.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--teal)] mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g., Jane Doe"
              className={`w-full bg-slate-900/60 border p-3.5 rounded-xl text-white placeholder:text-slate-500 text-sm transition-all focus:outline-none ${
                error
                  ? "border-rose-500/80 focus:ring-2 focus:ring-rose-500/30"
                  : "border-white/10 focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/20"
              }`}
            />
            {error && (
              <p className="text-rose-400 text-xs font-medium mt-2 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400" />
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              href="/students"
              className="w-1/2 text-center py-3.5 px-4 rounded-xl text-sm font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-1/2 py-3.5 px-4 rounded-xl text-sm font-bold text-slate-950 bg-[var(--lime)] hover:bg-[var(--lime-hover)] transition-all shadow-lg shadow-[var(--lime)]/20 hover:shadow-xl hover:shadow-[var(--lime)]/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? "Saving..." : "Save Student"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}