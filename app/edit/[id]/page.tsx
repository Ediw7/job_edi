"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Bell } from "lucide-react";

// Gunakan React.use() untuk mengambil params di Next.js terbaru
export default function EditLoker({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params); // Membuka promise params secara aman
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/applications/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const app = data.data;
          // Pengecekan aman agar tidak error 'reading interviewDate of null'
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

  if (loading) return <div className="p-12 text-center text-slate-500">Memuat data lamaran...</div>;
  if (!form) return <div className="p-12 text-center text-red-500">Data tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex justify-center items-start pt-12 text-slate-900">
      <div className="w-full max-w-xl">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition">
          <ArrowLeft size={20} /> Kembali ke Dashboard
        </Link>
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <h1 className="text-2xl font-bold mb-1">Update Progres</h1>
          <p className="text-slate-500 mb-8">{form.companyName} — {form.position}</p>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2">Status Lamaran</label>
              <select
                className="w-full p-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-blue-500 font-bold text-blue-600 transition"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Rencana">Rencana (Wishlist)</option>
                <option value="Terkirim">Terkirim (Applied)</option>
                <option value="Wawancara">Wawancara (Interview)</option>
                <option value="Diterima">Diterima (Accepted) ✅</option>
                <option value="Ditolak">Ditolak (Rejected) ❌</option>
              </select>
            </div>

            {form.status === 'Wawancara' && (
              <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100">
                <label className="flex items-center gap-2 text-sm font-bold text-orange-700 mb-3">
                  <Bell size={18} /> Jadwal Wawancara
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
                  value={form.interviewDate || ""}
                  onChange={(e) => setForm({ ...form, interviewDate: e.target.value })}
                />
                <p className="text-[10px] text-orange-400 mt-2 font-medium">*Bot akan mengirim pengingat WA H-1 ke {form.owner}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold mb-2">Catatan Tambahan</label>
              <textarea
                className="w-full p-4 rounded-2xl border outline-none h-32 focus:ring-2 focus:ring-blue-500 transition text-sm"
                placeholder="Tulis persiapan atau info HRD di sini..."
                value={form.notes || ""}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              ></textarea>
            </div>

            <button type="submit" className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl transition flex justify-center items-center gap-2 uppercase tracking-widest">
              <Save size={20} /> Simpan Perubahan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}