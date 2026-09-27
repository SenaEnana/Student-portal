"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface EditProps {
  params: Promise<{ id: string }>;
}

export default function EditStudentPage({ params }: EditProps) {
  const { id } = use(params);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch("/api/items");
        const data = await res.json();
        if (Array.isArray(data)) {
          const currentItem = data.find((item: { id: number; name: string }) => item.id.toString() === id);
          if (currentItem) {
            setName(currentItem.name);
          } else {
            setError("Student record not found.");
          }
        }
      } catch (err) {
        console.error("ERROR FETCHING:", err);
        setError("Failed to load student data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
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
      const res = await fetch(`/api/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName }),
      });

      if (res.ok) {
        router.push("/students?message=Student profile modified successfully.");
      } else {
        setError("Failed to update student.");
      }
    } catch (err) {
      console.error("ERROR:", err);
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center text-white">
        <div className="flex items-center gap-3 bg-[var(--surface)]/80 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-2xl shadow-2xl">
          <span className="w-3 h-3 rounded-full bg-[var(--teal)] animate-ping" />
          <span className="text-sm font-medium text-[var(--muted)]">Loading student profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center p-4 md:p-6 relative overflow-hidden text-white">
      {/* Background Decorative Glow Orbs */}
      <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-[var(--teal)]/15 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-[var(--violet)]/20 rounded-full blur-3xl pointer-events-none -translate-x-1/2 translate-y-1/2" />

      {/* Main Glass Card Form */}
      <div className="max-w-lg w-full font-sans shadow-2xl rounded-3xl p-6 md:p-10 bg-[var(--surface)]/80 backdrop-blur-xl border border-white/10 relative z-10 overflow-hidden">
        
        {/* Top Decorative Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-to-b from-[var(--violet)]/30 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-[var(--lime)] via-[var(--teal)] to-[var(--violet)] bg-clip-text text-transparent">
              Edit Student
            </span>
          </h1>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold text-[var(--teal)] bg-[var(--teal)]/10 border border-[var(--teal)]/20">
            ID #{id}
          </span>
        </div>

        <p className="text-[var(--muted)] text-sm mb-8 leading-relaxed">
          Modify and update the existing student details in the directory.
        </p>

        <form onSubmit={handleUpdate} className="space-y-6">
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
              placeholder="e.g., John Doe"
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
              {isSubmitting ? "Updating..." : "Update Student"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}