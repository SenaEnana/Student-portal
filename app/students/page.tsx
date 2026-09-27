"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface Item {
  id: number;
  name: string;
}

function StudentsDashboardContent() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Item | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const inlineMessage = searchParams.get("message");

  useEffect(() => {
    if (inlineMessage) {
      setToastMessage(inlineMessage);

      const timer = setTimeout(() => {
        setToastMessage(null);
        router.replace("/students");
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [inlineMessage, router]);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/items");
      const data = await res.json();
      if (Array.isArray(data)) {
        setItems(data);
      }
    } catch (error) {
      console.error("ERROR FETCHING:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const confirmDelete = async () => {
    if (!studentToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/items/${studentToDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        setToastMessage(`Student "${studentToDelete.name}" permanently deleted.`);
        fetchItems();

        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (error) {
      console.error("ERROR DELETING:", error);
    } finally {
      setIsDeleting(false);
      setStudentToDelete(null); // Close modal
    }
  };

  return (
    <div className="min-h-screen animated-bg p-6 md:p-10 relative text-white">
      <div className="max-w-5xl mx-auto">

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--lime)]/40 text-[var(--lime)] font-medium px-5 py-3 rounded-xl shadow-2xl flex items-center justify-between gap-4 transition-all animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--lime)] animate-pulse" />
              <p className="text-sm text-slate-100">{toastMessage}</p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white text-xs font-mono pl-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-[var(--lime)] via-[var(--teal)] to-[var(--violet)] bg-clip-text text-transparent">
                Student Directory
              </span>
            </h1>
            <p className="text-[var(--muted)] text-sm mt-1">Manage and update active student records</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/"
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              ← Home
            </Link>
            <Link
              href="/students/add"
              className="flex-1 sm:flex-none text-center px-5 py-2.5 rounded-xl text-sm font-bold text-slate-950 bg-[var(--lime)] hover:bg-[var(--lime-hover)] transition-all shadow-lg shadow-[var(--lime)]/20 hover:shadow-xl hover:shadow-[var(--lime)]/30 hover:-translate-y-0.5"
            >
              + Add Student
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[var(--surface)]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-[var(--teal)] font-bold">
              <tr>
                <th className="p-4 pl-6">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center p-12 text-[var(--muted)]">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[var(--teal)] animate-ping" />
                      Loading student records...
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center p-12 text-[var(--muted)]">
                    No students found. Click <span className="text-[var(--lime)] font-semibold">&quot;+ Add Student&quot;</span> to create one.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4 pl-6 font-mono text-xs text-[var(--violet)] font-semibold">
                      #{item.id}
                    </td>
                    <td className="p-4 font-medium text-slate-100 group-hover:text-white transition-colors">
                      {item.name}
                    </td>
                    <td className="p-4 pr-6 text-right space-x-3">
                      <Link
                        href={`/students/${item.id}/edit`}
                        className="inline-block px-3 py-1 rounded-lg text-xs font-semibold text-[var(--teal)] hover:bg-[var(--teal)]/10 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setStudentToDelete(item)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-sm w-full bg-[var(--surface)]/95 backdrop-blur-2xl border border-rose-500/30 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
            {/* Red Accent Blur Circle */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Student?</h3>
                <p className="text-xs text-rose-400 font-medium">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Are you sure you want to permanently delete <span className="font-semibold text-white">&quot;{studentToDelete.name}&quot;</span> (ID: #{studentToDelete.id}) from the database?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setStudentToDelete(null)}
                disabled={isDeleting}
                className="w-1/2 py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="w-1/2 py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/30 hover:shadow-xl hover:shadow-rose-600/40 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function StudentsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen animated-bg p-10 text-center text-white">Loading dashboard...</div>}>
      <StudentsDashboardContent />
    </Suspense>
  );
}