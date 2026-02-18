"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Link as LinkIcon, Image as ImageIcon, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const LIME = "#84cc16";
const LIME_BG = "#f7fee7";
const LIME_BD = "#bef264";

function TambahForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const owner = searchParams.get("owner") || "Edi";

  const [form, setForm] = useState({
    companyName: "", position: "", owner,
    source: "LinkedIn", status: "Terkirim",
    linkPostingan: "", fotoPoster: "", notes: ""
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
        router.refresh();
        router.push("/");
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
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 flex justify-center items-start pt-12">
      <div className="w-full max-w-lg">

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700 mb-8 transition-colors font-medium"
        >
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>

        <Card className="bg-white border-slate-100 py-0 gap-0 overflow-hidden shadow-sm rounded-2xl">
          {/* Lime top accent */}
          <div style={{ height: "3px", background: LIME, borderRadius: "12px 12px 0 0" }} />

          <CardHeader className="px-6 pt-6 pb-0">
            <div className="flex items-center gap-3 mb-1">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: LIME_BG, border: `1px solid ${LIME_BD}` }}
              >
                <Briefcase size={18} style={{ color: LIME }} />
              </div>
              <div>
                <CardTitle className="text-lg font-black text-slate-900">
                  Tambah Lamaran
                </CardTitle>
                <CardDescription className="text-xs font-semibold" style={{ color: LIME }}>
                  untuk {owner}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-6 pt-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">
                    Nama Perusahaan *
                  </label>
                  <Input
                    required
                    placeholder="Contoh: PT Gojek Indonesia"
                    className="bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-300 focus-visible:ring-1 focus-visible:ring-lime-400 focus-visible:border-lime-400 rounded-xl"
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">
                    Posisi *
                  </label>
                  <Input
                    required
                    placeholder="Contoh: Frontend Developer"
                    className="bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-300 focus-visible:ring-1 focus-visible:ring-lime-400 focus-visible:border-lime-400 rounded-xl"
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Status</label>
                  <select
                    className="w-full h-9 px-3 rounded-xl text-sm font-medium bg-slate-50 border border-slate-200 text-slate-700 outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400"
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="Terkirim">Terkirim</option>
                    <option value="Rencana">Rencana</option>
                    <option value="Wawancara">Wawancara</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Sumber</label>
                  <select
                    className="w-full h-9 px-3 rounded-xl text-sm font-medium bg-slate-50 border border-slate-200 text-slate-700 outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400"
                    onChange={(e) => setForm({ ...form, source: e.target.value })}
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Email">Email</option>
                    <option value="Form">Google Form</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Link Postingan</label>
                  <div className="relative">
                    <LinkIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <Input
                      placeholder="https://..."
                      className="pl-9 bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-300 focus-visible:ring-1 focus-visible:ring-lime-400 focus-visible:border-lime-400 rounded-xl"
                      onChange={(e) => setForm({ ...form, linkPostingan: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">URL Foto Poster</label>
                  <div className="relative">
                    <ImageIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <Input
                      placeholder="https://i.imgur.com/..."
                      className="pl-9 bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-300 focus-visible:ring-1 focus-visible:ring-lime-400 focus-visible:border-lime-400 rounded-xl"
                      onChange={(e) => setForm({ ...form, fotoPoster: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full font-bold gap-2 mt-2 transition-all duration-200 hover:-translate-y-0.5 text-white rounded-xl shadow-sm"
                style={{ background: LIME, border: "none" }}
              >
                <Save size={15} /> Simpan Lamaran
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense><TambahForm /></Suspense>;
}