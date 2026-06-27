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

useEffect(() => {
const fn = async () => {
try {
const q = query(collection(db, "templates"), orderBy("createdAt", "desc"));
const snap = await getDocs(q);
setTemplates(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
} catch (e) {
console.error(e);
} finally {
setLoading(false);
}
};
fn();
}, []);

const handlePreview = async (id, url) => {
if (previews[id]) {
setPreviews((p) => ({ ...p, [id]: null }));
return;
}
try {
const res = await fetch(url);
const buf = await res.arrayBuffer();
const wb = XLSX.read(buf, { type: "array" });
const ws = wb.Sheets[wb.SheetNames[0]];
setPreviews((p) => ({ ...p, [id]: XLSX.utils.sheet_to_json(ws, { header: 1 }).slice(0, 5) }));
} catch (e) {
console.error(e);
}
};

if (loading) {
return (
<div className="flex items-center justify-center min-h-screen">
<p className="text-gray-500">Memuat...</p>
</div>
);
}

return (
<div className="min-h-screen bg-gray-50">
<header className="bg-white border-b border-gray-200 px-6 py-4">
<nav className="flex justify-between items-center max-w-7xl mx-auto">
<Link href="/" className="text-2xl font-bold text-green-800">Nuwana Excel</Link>
<div className="flex gap-3">
<Link href="/login" className="border border-green-800 text-green-800 px-4 py-2 rounded-lg text-sm font-semibold">Login</Link>
<Link href="/upload" className="bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold">Upload</Link>
</div>
</nav>
</header>

<main className="max-w-7xl mx-auto px-6 py-12">
<h1 className="text-4xl font-bold text-green-800 text-center mb-12">Template Excel</h1>

{templates.length === 0 && (
<div className="text-center py-24">
<p className="text-gray-400 mb-6">Belum ada template.</p>
<Link href="/upload" className="bg-green-800 text-white px-6 py-3 rounded-xl font-semibold">Upload Template</Link>
</div>
)}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{templates.map((t) => (
<div key={t.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
<div className="h-48 bg-gray-900">
<video src={t.videoUrl} className="w-full h-full object-cover" preload="metadata" controls />
</div>
<div className="p-5">
<h3 className="text-lg font-bold text-gray-800 mb-4">{t.judul}</h3>
<div className="flex gap-3">
<a href={t.xlsxUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-green-800 text-white font-semibold py-2 rounded-lg text-sm">Download</a>
<button onClick={() => handlePreview(t.id, t.xlsxUrl)} className="px-4 py-2 border border-green-800 text-green-800 rounded-lg text-sm font-semibold">{previews[t.id] ? "Tutup" : "Preview"}</button>
</div>
{previews[t.id] && (
<div className="mt-4 overflow-x-auto border border-gray-200 rounded-lg">
<table className="w-full text-xs border-collapse">
<tbody>
{previews[t.id].map((row, ri) => (
<tr key={ri} className={ri === 0 ? "bg-green-100 font-semibold" : "bg-white"}>
{row.map((cell, ci) => (
<td key={ci} className="border border-gray-200 px-2 py-1 whitespace-nowrap">{cell ?? ""}</td>
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
</div>
</main>

<footer className="text-center py-6 border-t border-gray-200">
<p className="text-sm text-gray-400">2024 Nuwana Excel</p>
</footer>
</div>
);
}
