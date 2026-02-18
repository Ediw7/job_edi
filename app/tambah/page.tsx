"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Link as LinkIcon, Image as ImageIcon } from "lucide-react";

function TambahForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const owner = searchParams.get("owner") || "Edi";

  const [form, setForm] = useState({
    companyName: "", position: "", owner: owner, source: "LinkedIn", status: "Terkirim", linkPostingan: "", fotoPoster: "", notes: ""
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.refresh(); // Segarkan data server
        router.push("/"); // Pindah ke dashboard
      } else {
        const errorData = await res.json();
        alert("Gagal menyimpan: " + errorData.error);
      }
    } catch (error) {
      console.error("Error saat submit:", error);
      alert("Terjadi kesalahan koneksi!");
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-12 flex justify-center">
      <div className="w-full max-w-xl">
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 mb-8 transition font-medium">
          <ArrowLeft size={18} /> Kembali
        </Link>
        <h1 className="text-3xl font-bold mb-2 text-slate-900">Input Baru: {owner}</h1>
        <p className="text-slate-500 mb-8">Tambahkan detail lamaran kerja yang baru saja dikirim.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <input required placeholder="Nama Perusahaan" className="w-full p-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
            <input required placeholder="Posisi (Contoh: Web Developer)" className="w-full p-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" onChange={(e) => setForm({ ...form, position: e.target.value })} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-white p-1 rounded-2xl border px-4">
              <LinkIcon size={18} className="text-slate-400" />
              <input placeholder="URL Link Postingan" className="w-full py-4 outline-none text-sm" onChange={(e) => setForm({ ...form, linkPostingan: e.target.value })} />
            </div>
            <div className="flex items-center gap-3 bg-white p-1 rounded-2xl border px-4">
              <ImageIcon size={18} className="text-slate-400" />
              <input placeholder="URL Foto/Screenshot Poster" className="w-full py-4 outline-none text-sm" onChange={(e) => setForm({ ...form, fotoPoster: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select className="p-4 rounded-2xl border outline-none bg-white font-medium" onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="Terkirim">Terkirim</option>
              <option value="Rencana">Rencana</option>
              <option value="Wawancara">Wawancara</option>
            </select>
            <select className="p-4 rounded-2xl border outline-none bg-white font-medium" onChange={(e) => setForm({ ...form, source: e.target.value })}>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Instagram">Instagram</option>
              <option value="Email">Email</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition">SIMPAN DATA</button>
        </form>
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense><TambahForm /></Suspense>;
}