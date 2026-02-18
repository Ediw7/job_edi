"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Bell, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const LIME = "#84cc16";
const LIME_BG = "#f7fee7";
const LIME_BD = "#bef264";

export default function EditLoker({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/applications/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const app = data.data;
          if (app.interviewDate) {
            app.interviewDate = new Date(app.interviewDate).toISOString().slice(0, 16);
          }
          setForm(app);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    const res = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/");
      router.refresh();
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-sm text-slate-400 font-medium">Memuat data...</p>
    </div>
  );

  if (!form) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-sm text-red-500">Data tidak ditemukan.</p>
    </div>
  );

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
                <CardTitle className="text-lg font-black text-slate-900">Update Progres</CardTitle>
                <CardDescription className="text-xs text-slate-400 truncate max-w-[260px]">
                  {form.companyName} — {form.position}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-6 pt-6 pb-6">
            <form onSubmit={handleUpdate} className="space-y-5">

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">
                  Status Lamaran
                </label>
                <select
                  className="w-full h-10 px-3 rounded-xl text-sm font-semibold bg-slate-50 border border-slate-200 text-slate-700 outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="Rencana">Rencana (Wishlist)</option>
                  <option value="Terkirim">Terkirim (Applied)</option>
                  <option value="Wawancara">Wawancara (Interview)</option>
                  <option value="Diterima">Diterima (Accepted)</option>
                  <option value="Ditolak">Ditolak (Rejected)</option>
                </select>
              </div>

              {form.status === "Wawancara" && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <label className="flex items-center gap-2 text-xs font-bold text-amber-600 mb-3">
                    <Bell size={13} /> Jadwal Wawancara
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full h-9 px-3 rounded-lg text-sm bg-white border border-amber-200 text-slate-700 outline-none focus:border-amber-400"
                    value={form.interviewDate || ""}
                    onChange={(e) => setForm({ ...form, interviewDate: e.target.value })}
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">
                  Catatan Tambahan
                </label>
                <textarea
                  className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-700 placeholder:text-slate-300 outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 h-28 resize-none transition-colors"
                  placeholder="Tulis persiapan atau info HRD di sini..."
                  value={form.notes || ""}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <Button
                type="submit"
                className="w-full font-bold gap-2 transition-all duration-200 hover:-translate-y-0.5 text-white rounded-xl shadow-sm"
                style={{ background: LIME, border: "none" }}
              >
                <Save size={15} /> Simpan Perubahan
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}