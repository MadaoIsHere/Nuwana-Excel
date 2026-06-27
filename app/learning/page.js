"use client";

import Link from "next/link";

const VIDEOS = [
  { id: 1, title: "Pengenalan VLOOKUP & XLOOKUP", duration: "12:30" },
  { id: 2, title: "Membuat Pivot Table dari Nol", duration: "18:45" },
  { id: 3, title: "Dashboard Excel dengan Chart Interaktif", duration: "22:10" },
];

export default function LearningPage() {
  return (
    <main className="min-h-screen bg-surface-container-low px-4 py-12">
      <header className="mb-10 px-6">
        <Link href="/templates" className="text-label-md font-label-md text-primary hover:underline">
          ← Kembali ke Templates
        </Link>
        <h1 className="text-headline-lg font-headline-lg text-primary mt-4">Video Belajar Excel</h1>
        <p className="text-body-md font-body-md text-on-surface-variant mt-2">
          Kumpulan video tutorial untuk menguasai Excel dari dasar hingga mahir.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-6">
        {VIDEOS.map((v) => (
          <div key={v.id} className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="h-40 bg-surface-container-high flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_circle
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-headline-sm font-headline-sm text-on-surface mb-1">{v.title}</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">{v.duration}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}