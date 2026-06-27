"use client";

import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";

export default function UploadForm() {
  const [judul, setJudul] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [xlsxFile, setXlsxFile] = useState(null);
  const [progress, setProgress] = useState({ videos: 0, templates: 0 });
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = (file, folder) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const pct = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress((prev) => ({ ...prev, [folder]: pct }));
        },
        (error) => reject(error),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!judul || !videoFile || !xlsxFile) {
      setStatus("⚠️ Lengkapi semua field terlebih dahulu.");
      return;
    }

    setIsUploading(true);
    try {
      setStatus("⏳ Mengunggah video...");
      const videoUrl = await uploadFile(videoFile, "videos");

      setStatus("⏳ Mengunggah file Excel...");
      const xlsxUrl = await uploadFile(xlsxFile, "templates");

      setStatus("⏳ Menyimpan data ke database...");
      await addDoc(collection(db, "templates"), {
        judul,
        videoUrl,
        xlsxUrl,
        createdAt: serverTimestamp(),
      });

      setStatus("✅ Upload berhasil! Template telah disimpan.");
      setJudul("");
      setVideoFile(null);
      setXlsxFile(null);
      setProgress({ videos: 0, templates: 0 });
    } catch (error) {
      console.error(error);
      setStatus("❌ Terjadi error: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-[#005931] mb-6">
        Upload Template Baru
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Judul Template
          </label>
          <input
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="Contoh: Budget Bulanan 2024"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#005931]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            File Video (.mp4)
          </label>
          <input
            type="file"
            accept="video/mp4"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#d0e5d2] file:text-[#005931] file:font-semibold"
          />
          {progress.videos > 0 && (
            <div className="mt-2 h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-[#005931] rounded-full transition-all"
                style={{ width: `${progress.videos}%` }}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            File Excel (.xlsx)
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setXlsxFile(e.target.files[0])}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#d0e5d2] file:text-[#005931] file:font-semibold"
          />
          {progress.templates > 0 && (
            <div className="mt-2 h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-[#005931] rounded-full transition-all"
                style={{ width: `${progress.templates}%` }}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="w-full bg-[#005931] text-white font-bold py-3 rounded-xl hover:bg-[#217346] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? "Mengunggah..." : "Upload Template"}
        </button>
      </form>

      {status && (
        <p className="mt-4 text-center text-sm font-medium text-gray-700">
          {status}
        </p>
      )}
    </div>
  );
}