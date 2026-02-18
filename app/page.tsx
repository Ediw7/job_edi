"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Briefcase, Calendar, Pencil, Trash2, ExternalLink, Image as ImageIcon } from "lucide-react";

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("Edi");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch("/api/applications");
    const data = await res.json();
    if (data.success) setApplications(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const deleteApp = async (id: string) => {
    if (confirm("Hapus data ini?")) {
      await fetch(`/api/applications/${id}`, { method: "DELETE" });
      fetchData();
    }
  };

  const filteredData = applications.filter((app: any) => app.owner === activeTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Rencana': return 'bg-slate-100 text-slate-600';
      case 'Terkirim': return 'bg-blue-100 text-blue-600';
      case 'Wawancara': return 'bg-orange-100 text-orange-600';
      case 'Diterima': return 'bg-green-100 text-green-600';
      case 'Ditolak': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">JobTracker.</h1>
          <Link href={`/tambah?owner=${activeTab}`} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition">
            <Plus size={20} /> Tambah Loker {activeTab}
          </Link>
        </header>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-8 bg-slate-200 p-1.5 rounded-2xl w-fit">
          <button onClick={() => setActiveTab("Edi")} className={`px-8 py-2.5 rounded-xl font-bold transition ${activeTab === "Edi" ? "bg-white shadow-md text-blue-600" : "text-slate-500"}`}>Edi</button>
          <button onClick={() => setActiveTab("Anis")} className={`px-8 py-2.5 rounded-xl font-bold transition ${activeTab === "Anis" ? "bg-white shadow-md text-pink-600" : "text-slate-500"}`}>Anis</button>
        </div>

        {loading ? <p className="text-center text-slate-400 py-20">Menghubungkan ke database...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredData.length === 0 ? (
              <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl text-slate-400">Belum ada lamaran tersimpan untuk {activeTab}</div>
            ) : filteredData.map((app: any) => (
              <div key={app._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(app.status)}`}>{app.status}</div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <Link href={`/edit/${app._id}`} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600"><Pencil size={16} /></Link>
                    <button onClick={() => deleteApp(app._id)} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900">{app.companyName}</h3>
                <p className="text-blue-600 font-semibold mb-4">{app.position}</p>

                {app.fotoPoster && (
                  <div className="mb-4 rounded-2xl overflow-hidden border aspect-video bg-slate-50">
                    <img src={app.fotoPoster} alt="Poster" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4 border-t border-slate-50 mt-auto">
                  {app.linkPostingan && (
                    <a href={app.linkPostingan} target="_blank" className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-900 font-medium">
                      <ExternalLink size={14} /> Link Loker
                    </a>
                  )}
                  {app.interviewDate && (
                    <div className="flex items-center gap-1 text-xs text-orange-600 font-bold">
                      <Calendar size={14} /> {new Date(app.interviewDate).toLocaleDateString('id-ID')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}