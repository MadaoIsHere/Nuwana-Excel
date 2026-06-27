// app/templates/page.js
// coba2
// tes
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import * as XLSX from "xlsx";
import Link from "next/link";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previews, setPreviews] = useState({});

  // Ambil data dari Firestore saat halaman pertama kali dibuka
  useEffect(() => {
    const getTemplates = async () => {
      try {
        const q = query(collection(db, "templates"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        setTemplates(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (e) {
        console.error("Gagal mengambil data:", e);
      } finally {
        setLoading(false);
      }
    };
    getTemplates();
  }, []);

  // Baca file Excel dari URL dan tampilkan 5 baris pertama
  const handlePreview = async (id, xlsxUrl) => {
    // Kalau sudah tampil, sembunyikan (toggle)
    if (previews[id]) {
      setPreviews((prev) => ({ ...prev, [id]: null }));
      return;
    }
    try {
      const res = await fetch(xlsxUrl);
      const buf = await res.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }).slice(0, 5);
      setPreviews((prev) => ({ ...prev, [id]: data }));
    } catch (e) {
      console.error("Gagal membaca Excel:", e);
    }
  };

  return (
    <>
      {/* ── Navbar ── */}
      <header className="w-full sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="text-2xl font-bold text-[#005931]">
            Nuwana Excel
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-[#005931] font-semibold px-4 py-2 rounded-lg border border-[#005931] hover:bg-[#f0eded] transition-colors text-sm"
            >
              Login
            </Link>
            <Link
              href="/upload"
              className="bg-[#005931] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#217346] transition-colors text-sm"
            >
              + Upload
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Konten Utama ── */}
      <main className="min-h-screen bg-[#f6f3f2] px-6 py-12">
        <div className="max-w-7xl mx-auto">

          {/* Judul halaman */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#005931] mb-3">
              Template Excel
            </h1>
            <p className="text-gray-500 text-lg">
              Download dan preview template Excel siap pakai.
            </p>
          </div>

          {/* ── State: Loading ── */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-10 h-10 border-4 border-[#005931] border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 text-sm">Memuat template...</p>
            </div>
          )}

          {/* ── State: Kosong ── */}
          {!loading && templates.length === 0 && (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">📂</p>
              <p className="text-gray-500 text-lg mb-6">
                Belum ada template. Jadilah yang pertama upload!
              </p>
              <Link
                href="/upload"
                className="bg-[#005931] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#217346] transition-colors"
              >
                Upload Template
              </Link>
            </div>
          )}

          {/* ── Grid Template ── */}
          {!loading && templates.length > 0 && (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:-translate-y-1 transition-transform duration-200"
                >
                  {/* Video player */}
                  <div className="h-48 bg-gray-900">
                    <video
                      src={t.videoUrl}
                      className="w-full h-full object-cover"
                      preload="metadata"
                      controls
                    />
                  </div>

                  {/* Info & tombol */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">
                      {t.judul}
                    </h3>
                    <p className="text-xs text-gray-400 mb-4">
                      {t.createdAt?.toDate
                        ? t.createdAt.toDate().toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : ""}
                    </p>

                    {/* Tombol Download & Preview */}
                    <div className="flex gap-3">
                      {/* Download — pakai tag <a> biasa, bukan emoji */}
                      
                        href={t.xlsxUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center bg-[#005931] text-white font-semibold py-2 rounded-lg hover:bg-[#217346] transition-colors text-sm"
                      >
                        Download Excel
                      </a>

                      {/* Preview */}
                      <button
                        onClick={() => handlePreview(t.id, t.xlsxUrl)}
                        className="px-4 py-2 border border-[#005931] text-[#005931] font-semibold rounded-lg hover:bg-[#f0eded] transition-colors text-sm"
                      >
                        {previews[t.id] ? "Tutup" : "Preview"}
                      </button>
                    </div>

                    {/* Tabel Preview Excel */}
                    {previews[t.id] && (
                      <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-400 px-3 pt-2">
                          Preview 5 baris pertama:
                        </p>
                        <table className="w-full text-xs border-collapse mt-1">
                          <tbody>
                            {previews[t.id].map((row, rowIdx) => (
                              <tr
                                key={rowIdx}
                                className={
                                  rowIdx === 0
                                    ? "bg-[#d0e5d2] font-semibold"
                                    : rowIdx % 2 === 0
                                    ? "bg-gray-50"
                                    : "bg-white"
                                }
                              >
                                {row.map((cell, colIdx) => (
                                  <td
                                    key={colIdx}
                                    className="border border-gray-200 px-2 py-1 whitespace-nowrap text-gray-700"
                                  >
                                    {cell ?? ""}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center">
        <p className="text-sm text-gray-400">
          © 2024 Nuwana Excel. Structured Wisdom for Professionals.
        </p>
      </footer>
    </>
  );
}