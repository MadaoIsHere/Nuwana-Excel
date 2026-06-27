"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import * as XLSX from "xlsx";
import Link from "next/link";

const CATEGORIES = ["All Templates", "Financial", "Project Management", "Personal", "Business"];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Templates");
  const [previews, setPreviews] = useState({});

  useEffect(() => {
    const getTemplates = async () => {
      try {
        const q = query(collection(db, "templates"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        setTemplates(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    getTemplates();
  }, []);

  const handlePreview = async (id, xlsxUrl) => {
    if (previews[id]) {
      setPreviews((p) => ({ ...p, [id]: null }));
      return;
    }
    try {
      const res = await fetch(xlsxUrl);
      const buf = await res.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      setPreviews((p) => ({ ...p, [id]: XLSX.utils.sheet_to_json(ws, { header: 1 }).slice(0, 5) }));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=IBM+Plex+Sans:wght@400;500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <header className="w-full top-0 sticky z-50 bg-surface border-b border-outline-variant shadow-sm">
        <nav className="flex justify-between items-center px-margin-desktop py-unit max-w-container-max mx-auto">
          <div className="flex items-center gap-gutter">
            <Link href="/" className="text-headline-md font-headline-md font-bold text-primary">Nuwana Excel</Link>
            <div className="hidden md:flex items-center gap-6">
              {["Templates", "Learning", "Community", "About"].map((item) => (
                <Link
                  key={item}
                  href={item === "Templates" ? "/templates" : item === "Learning" ? "/learning" : "#"}
                  className={`text-label-md font-label-md transition-colors ${
                    item === "Templates" ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <input className="bg-surface-container-low border border-outline-variant rounded-full py-2 pl-10 pr-4 text-body-sm focus:outline-none focus:border-primary w-64" placeholder="Search templates..." type="text" />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
            </div>
            <Link href="/login" className="text-label-md font-label-md text-primary px-4 py-2 hover:bg-surface-container-high rounded-full transition-all">Login</Link>
            <Link href="/login" className="text-label-md font-label-md bg-primary text-white px-6 py-2 rounded-full hover:opacity-90 active:scale-95 transition-all">Register</Link>
            <Link href="/upload" className="text-label-md font-label-md bg-secondary-container text-primary px-4 py-2 rounded-full hover:opacity-90 transition-all">+ Upload</Link>
          </div>
        </nav>
      </header>

      <main className="max-w-container-max mx-auto px-margin-desktop py-12 wayang-pattern">
        <section className="mb-16 text-center max-w-3xl mx-auto">
          <h1 className="text-headline-xl font-headline-xl text-primary mb-4">Structured Wisdom for Your Data</h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant">Master your workflow with professionally designed Excel templates.</p>
        </section>

        <section className="mb-12 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
          <div className="flex flex-col md:flex-row gap-gutter items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full text-label-sm font-label-sm transition-colors ${
                    activeCategory === cat ? "bg-primary text-white shadow-md" : "bg-secondary-container text-on-surface hover:bg-primary-fixed"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-label-md font-label-md text-on-surface-variant">Sort by:</span>
              <select className="bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 text-body-sm focus:border-primary outline-none">
                <option>Most Popular</option>
                <option>Newest</option>
                <option>Top Rated</option>
              </select>
            </div>
          </div>
        </section>

        <div className="gunungan-divider mb-16"></div>

        {loading ? (
          <p className="text-center py-20 text-on-surface-variant">Loading...</p>
        ) : templates.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-on-surface-variant mb-4">Belum ada template.</p>
            <Link href="/upload" className="bg-primary text-white px-6 py-3 rounded-xl text-label-md font-label-md hover:bg-primary-container transition-colors">+ Upload Template</Link>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {templates.map((t) => (
              <div key={t.id} className="group bg-surface rounded-xl border border-outline-variant overflow-hidden template-card-shadow transition-transform hover:-translate-y-1">
                <div className="relative h-48 bg-surface-container-high overflow-hidden">
                  <video src={t.videoUrl} className="w-full h-full object-cover" preload="metadata" muted />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <span className="material-symbols-outlined text-white text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-secondary-container text-primary text-label-sm font-label-sm px-3 py-1 rounded-full">Excel</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-headline-sm font-headline-sm text-on-surface">{t.judul}</h3>
                    <div className="flex items-center gap-1 text-tertiary">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-label-sm font-label-sm">5.0</span>
                    </div>
                  </div>
                  <p className="text-body-sm font-body-sm text-on-surface-variant mb-6">Template Excel profesional siap pakai.</p>

                  <div className="flex gap-3">
                    
                      href={t.xlsxUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-primary text-on-primary text-label-md font-label-md py-3 rounded-lg hover:opacity-90 active:scale-95 transition-all"
                    >
                      ⬇ Download
                    </a>
                    <button
                      onClick={() => handlePreview(t.id, t.xlsxUrl)}
                      className="px-4 py-3 border border-primary text-primary rounded-lg hover:bg-surface-container transition-all flex items-center gap-2 text-label-md font-label-md"
                    >
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                      Preview
                    </button>
                  </div>

                  {previews[t.id] && (
                    <div className="mt-4 overflow-x-auto">
                      <p className="text-label-sm font-label-sm text-on-surface-variant mb-2">Preview 5 baris pertama:</p>
                      <table className="w-full text-xs border-collapse">
                        <tbody>
                          {previews[t.id].map((row, ri) => (
                            <tr key={ri} className={ri === 0 ? "bg-secondary-container" : ""}>
                              {row.map((cell, ci) => (
                                <td key={ci} className="border border-outline-variant px-2 py-1 whitespace-nowrap text-on-surface">{cell ?? ""}</td>
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

        <section className="mt-20 bg-primary text-on-primary p-12 rounded-2xl relative overflow-hidden shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-gutter">
            <div className="max-w-xl">
              <h2 className="text-headline-lg font-headline-lg mb-4">Need a Custom Excel Solution?</h2>
              <p className="text-body-md font-body-md opacity-90">Our experts can build tailored templates specifically for your business needs.</p>
            </div>
            <button className="bg-surface text-primary text-label-md font-label-md px-8 py-4 rounded-xl hover:scale-105 transition-transform font-bold">Consult with our Experts</button>
          </div>
          <div className="absolute right-[-50px] top-[-50px] opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[300px]" style={{ fontVariationSettings: "'FILL' 1" }}>functions</span>
          </div>
        </section>
      </main>

      <footer className="w-full py-gutter bg-surface-container-highest border-t border-outline-variant">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter px-margin-desktop max-w-container-max mx-auto">
          <div className="space-y-4">
            <h2 className="text-headline-sm font-headline-sm text-primary">Nuwana Excel</h2>
            <p className="text-body-sm font-body-sm text-on-surface-variant max-w-xs">Bridging traditional wisdom with modern technical precision.</p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-label-md font-label-md text-on-surface font-bold mb-2">Navigation</span>
            {["Privacy Policy", "Terms of Service", "Help Center", "Contact Us"].map((l) => (
              <a key={l} className="text-body-sm font-body-sm text-on-surface-variant hover:text-secondary transition-colors" href="#">{l}</a>
            ))}
          </div>
          <div className="space-y-4">
            <span className="text-label-md font-label-md text-on-surface font-bold">Stay Updated</span>
            <div className="flex gap-2">
              <input className="bg-surface border border-outline-variant rounded-lg px-4 py-2 text-body-sm w-full focus:outline-none focus:border-primary" placeholder="Email address" type="email" />
              <button className="bg-primary text-on-primary px-4 py-2 rounded-lg"><span className="material-symbols-outlined">send</span></button>
            </div>
            <p className="text-body-sm font-body-sm text-on-surface-variant">© 2024 Nuwana Excel. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}