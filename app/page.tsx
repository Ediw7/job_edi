"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Briefcase, Calendar, Pencil, Trash2, ExternalLink, Search, TrendingUp } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const LIME = "#84cc16";   // lime-500 — lebih readable di bg putih
const LIME_BG = "#f7fee7";   // lime-50
const LIME_BD = "#bef264";   // lime-300

type Application = {
  _id: string;
  companyName: string;
  position: string;
  owner: "Edi" | "Anis";
  status: string;
  linkPostingan?: string;
  fotoPoster?: string;
  interviewDate?: string;
  createdAt: string;
};

const STATUS_CONFIG: Record<string, string> = {
  Rencana: "bg-slate-100 text-slate-500 border-slate-200",
  Terkirim: "bg-blue-50 text-blue-600 border-blue-200",
  Wawancara: "bg-amber-50 text-amber-600 border-amber-200",
  Diterima: "bg-lime-50 text-lime-700 border-lime-300",
  Ditolak: "bg-red-50 text-red-500 border-red-200",
};

export default function Dashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<"Edi" | "Anis">("Edi");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const filteredData = applications
    .filter((app) => app.owner === activeTab)
    .filter((app) =>
      search === "" ||
      app.companyName.toLowerCase().includes(search.toLowerCase()) ||
      app.position.toLowerCase().includes(search.toLowerCase())
    );

  const userApps = applications.filter((a) => a.owner === activeTab);
  const stats = {
    total: userApps.length,
    wawancara: userApps.filter((a) => a.status === "Wawancara").length,
    diterima: userApps.filter((a) => a.status === "Diterima").length,
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <header className="mb-8">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Job<span style={{ color: LIME }}>Tracker</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Pantau lamaran kerja
          </p>
        </header>

        {/* ── Tabs + Tambah ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <Tabs
            value={activeTab}
            onValueChange={(v) => { setActiveTab(v as "Edi" | "Anis"); setSearch(""); }}
          >
            <TabsList className="bg-white border border-slate-200 p-1 h-auto rounded-xl gap-1 shadow-sm">
              <TabsTrigger
                value="Edi"
                className={cn(
                  "rounded-lg px-8 py-2 font-bold text-sm transition-all duration-200",
                  "data-[state=active]:text-white data-[state=inactive]:text-slate-400",
                  "data-[state=inactive]:hover:text-slate-700"
                )}
                style={activeTab === "Edi" ? { background: LIME } : {}}
              >
                Edi
              </TabsTrigger>
              <TabsTrigger
                value="Anis"
                className={cn(
                  "rounded-lg px-8 py-2 font-bold text-sm transition-all duration-200",
                  "data-[state=active]:text-white data-[state=inactive]:text-slate-400",
                  "data-[state=inactive]:hover:text-slate-700"
                )}
                style={activeTab === "Anis" ? { background: LIME } : {}}
              >
                Anis
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            asChild
            className="font-bold gap-2 text-white rounded-xl shadow-sm hover:-translate-y-0.5 transition-all duration-200"
            style={{ background: LIME, border: "none" }}
          >
            <Link href={`/tambah?owner=${activeTab}`}>
              <Plus size={16} /> Tambah Loker {activeTab}
            </Link>
          </Button>
        </div>

        {/* ── Stats ── */}
        <div className="flex gap-2 flex-wrap mb-6">
          <Badge variant="outline" className="gap-1.5 text-slate-500 border-slate-200 bg-white text-xs font-semibold shadow-sm">
            <Briefcase size={11} /> {stats.total} Lamaran
          </Badge>
          {stats.wawancara > 0 && (
            <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-200 bg-amber-50 text-xs font-semibold">
              <Calendar size={11} /> {stats.wawancara} Wawancara
            </Badge>
          )}
          {stats.diterima > 0 && (
            <Badge variant="outline" className="gap-1.5 text-lime-700 border-lime-300 bg-lime-50 text-xs font-semibold">
              <TrendingUp size={11} /> {stats.diterima} Diterima
            </Badge>
          )}
        </div>

        {/* ── Search ── */}
        <div className="relative mb-8">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Cari perusahaan atau posisi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-lime-400 focus-visible:border-lime-400 rounded-xl shadow-sm"
          />
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white">
            <p className="text-sm text-slate-400 font-medium">Menghubungkan ke database...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white">
            <p className="font-bold text-slate-400 mb-2">
              {search ? "Tidak ada hasil" : `Belum ada lamaran untuk ${activeTab}`}
            </p>
            <p className="text-sm text-slate-300">
              {search ? "Coba kata kunci lain" : "Klik tombol di atas untuk menambahkan"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map((app) => (
              <Card
                key={app._id}
                className="group relative overflow-hidden py-0 gap-0 rounded-2xl bg-white border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Lime top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"
                  style={{ background: LIME }}
                />

                <CardHeader className="pt-5 pb-0 px-5">
                  <div className="flex justify-between items-start">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-black uppercase tracking-widest rounded-full px-3 py-0.5",
                        STATUS_CONFIG[app.status] ?? "bg-slate-100 text-slate-500 border-slate-200"
                      )}
                    >
                      {app.status}
                    </Badge>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-7 w-7 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                      >
                        <Link href={`/edit/${app._id}`}><Pencil size={13} /></Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                        onClick={() => deleteApp(app._id)}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-5 pt-4 pb-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: LIME_BG, border: `1px solid ${LIME_BD}` }}
                    >
                      <Briefcase size={17} style={{ color: LIME }} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate leading-tight text-sm">{app.companyName}</p>
                      <p className="text-xs font-semibold truncate text-slate-400 mt-0.5">{app.position}</p>
                    </div>
                  </div>

                  {app.fotoPoster && (
                    <div className="mb-4 rounded-xl overflow-hidden border border-slate-100 aspect-video bg-slate-50">
                      <img src={app.fotoPoster} alt="Poster" className="w-full h-full object-cover" />
                    </div>
                  )}
                </CardContent>

                <CardFooter className="px-5 pt-3 pb-5 border-t border-slate-50 mt-4 flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Calendar size={11} />
                    {new Date(app.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </span>

                  {app.interviewDate && (
                    <Badge variant="outline" className="text-[10px] font-bold text-amber-600 border-amber-200 bg-amber-50 gap-1 rounded-full">
                      <Calendar size={10} />
                      {new Date(app.interviewDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                    </Badge>
                  )}

                  {app.linkPostingan && (
                    <a
                      href={app.linkPostingan}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-auto flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      <ExternalLink size={11} /> Link
                    </a>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}