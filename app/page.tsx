"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus, Briefcase, Calendar, Pencil, Trash2,
  ExternalLink, Search, TrendingUp, Send, SlidersHorizontal
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const LIME = "#84cc16";
const LIME_BG = "#f7fee7";
const LIME_BD = "#bef264";

type Application = {
  _id: string;
  companyName: string;
  position: string;
  owner: "Edi" | "Anis";
  status: string;
  source?: string;
  notes?: string;
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

const STATUS_LIST = ["Semua", "Rencana", "Terkirim", "Wawancara", "Diterima", "Ditolak"];
const SORT_LIST = ["Terbaru", "Terlama", "A-Z Perusahaan", "Z-A Perusahaan"];

// Hitung sisa hari menuju interview
function daysUntil(dateStr: string): number {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr); target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / 86400000);
}

export default function Dashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<"Edi" | "Anis">("Edi");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [sortBy, setSortBy] = useState("Terbaru");

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch("/api/applications");
    const data = await res.json();
    if (data.success) setApplications(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const deleteApp = async (id: string) => {
    await fetch(`/api/applications/${id}`, { method: "DELETE" });
    fetchData();
  };

  const userApps = applications.filter((a) => a.owner === activeTab);

  const stats = {
    total: userApps.length,
    terkirim: userApps.filter((a) => a.status === "Terkirim").length,
    wawancara: userApps.filter((a) => a.status === "Wawancara").length,
    diterima: userApps.filter((a) => a.status === "Diterima").length,
  };

  const filteredData = userApps
    .filter((app) => filterStatus === "Semua" || app.status === filterStatus)
    .filter((app) =>
      search === "" ||
      app.companyName.toLowerCase().includes(search.toLowerCase()) ||
      app.position.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "Terbaru") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "Terlama") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "A-Z Perusahaan") return a.companyName.localeCompare(b.companyName);
      if (sortBy === "Z-A Perusahaan") return b.companyName.localeCompare(a.companyName);
      return 0;
    });

  // Cari semua wawancara H-1 atau hari ini dari SEMUA user
  const urgentInterviews = applications.filter((app) => {
    if (!app.interviewDate || app.status !== "Wawancara") return false;
    const d = daysUntil(app.interviewDate);
    return d === 0 || d === 1;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <header className="mb-8">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Job<span style={{ color: LIME }}>Tracker</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">Pantau lamaran kerja</p>
        </header>

        {/* ── Tabs + Tambah ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as "Edi" | "Anis"); setSearch(""); setFilterStatus("Semua"); }}>
            <TabsList className="bg-white border border-slate-200 p-1 h-auto rounded-xl gap-1 shadow-sm">
              {(["Edi", "Anis"] as const).map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className={cn(
                    "rounded-lg px-8 py-2 font-bold text-sm transition-all duration-200",
                    "data-[state=active]:text-white data-[state=inactive]:text-slate-400",
                    "data-[state=inactive]:hover:text-slate-700"
                  )}
                  style={activeTab === tab ? { background: LIME } : {}}
                >
                  {tab}
                </TabsTrigger>
              ))}
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

        {/* ── H-1 / Hari Ini Alert Banner ── */}
        {urgentInterviews.length > 0 && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-orange-200 shadow-md">
            {/* Header banner */}
            <div className="bg-orange-500 px-5 py-3 flex items-center gap-3">
              <Calendar size={18} className="text-white flex-shrink-0" />
              <p className="font-black text-white text-sm uppercase tracking-wide">
                {urgentInterviews.some(a => daysUntil(a.interviewDate!) === 0)
                  ? "Wawancara Hari Ini!"
                  : "Pengingat Wawancara — H-1"}
              </p>
            </div>
            {/* Items */}
            <div className="bg-orange-50 divide-y divide-orange-100">
              {urgentInterviews.map((app) => {
                const d = daysUntil(app.interviewDate!);
                return (
                  <div key={app._id} className="px-5 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black",
                        d === 0 ? "bg-red-500 text-white" : "bg-orange-400 text-white"
                      )}>
                        {d === 0 ? "NOW" : "H-1"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate">{app.companyName}</p>
                        <p className="text-xs text-slate-500 truncate">{app.position} · <span className="font-semibold text-orange-600">{app.owner}</span></p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={cn("text-xs font-bold", d === 0 ? "text-red-600" : "text-orange-600")}>
                        {d === 0 ? "Hari ini!" : "Besok"}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {new Date(app.interviewDate!).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total", value: stats.total, icon: Briefcase, color: "text-slate-600", bg: "bg-slate-100" },
            { label: "Terkirim", value: stats.terkirim, icon: Send, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Wawancara", value: stats.wawancara, icon: Calendar, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Diterima", value: stats.diterima, icon: TrendingUp, color: "text-lime-700", bg: "bg-lime-50" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <Card key={label} className="bg-white border-slate-100 shadow-sm rounded-2xl py-0 gap-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</span>
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", bg)}>
                    <Icon size={14} className={color} />
                  </div>
                </div>
                <p className={cn("text-3xl font-black", color)}>{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Search + Filter + Sort ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              placeholder="Cari perusahaan atau posisi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-lime-400 focus-visible:border-lime-400 rounded-xl shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <SlidersHorizontal size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-8 pr-3 h-9 rounded-xl text-sm font-medium bg-white border border-slate-200 text-slate-600 outline-none focus:border-lime-400 shadow-sm appearance-none cursor-pointer"
              >
                {STATUS_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 h-9 rounded-xl text-sm font-medium bg-white border border-slate-200 text-slate-600 outline-none focus:border-lime-400 shadow-sm appearance-none cursor-pointer"
            >
              {SORT_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white">
            <p className="text-sm text-slate-400 font-medium">Menghubungkan ke database...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: LIME_BG, border: `1px solid ${LIME_BD}` }}>
              <Briefcase size={28} style={{ color: LIME }} />
            </div>
            <p className="font-bold text-slate-700 mb-1">
              {search || filterStatus !== "Semua" ? "Tidak ada hasil" : `Belum ada lamaran untuk ${activeTab}`}
            </p>
            <p className="text-sm text-slate-400 mb-6">
              {search || filterStatus !== "Semua" ? "Coba ubah filter atau kata kunci pencarian" : "Mulai tambahkan lamaran kerja pertama kamu"}
            </p>
            {!search && filterStatus === "Semua" && (
              <Button asChild className="font-bold gap-2 text-white rounded-xl" style={{ background: LIME, border: "none" }}>
                <Link href={`/tambah?owner=${activeTab}`}><Plus size={15} /> Tambah Lamaran Pertama</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map((app) => {
              const days = app.interviewDate ? daysUntil(app.interviewDate) : null;
              return (
                <Card
                  key={app._id}
                  className="group relative overflow-hidden py-0 gap-0 rounded-2xl bg-white border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Lime top accent on hover */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"
                    style={{ background: LIME }}
                  />

                  <CardHeader className="pt-5 pb-0 px-5">
                    <div className="flex justify-between items-start">
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] font-black uppercase tracking-widest rounded-full px-3 py-0.5",
                          STATUS_CONFIG[app.status] ?? "bg-slate-100 text-slate-500 border-slate-200"
                        )}
                      >
                        {app.status}
                      </Badge>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button variant="ghost" size="icon" asChild className="h-7 w-7 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
                          <Link href={`/edit/${app._id}`}><Pencil size={13} /></Link>
                        </Button>

                        {/* ── Delete Dialog ── */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                              <Trash2 size={13} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus lamaran ini?</AlertDialogTitle>
                              <AlertDialogDescription>
                                <span className="font-semibold text-slate-700">{app.companyName}</span> — {app.position}
                                <br />Data yang dihapus tidak bisa dikembalikan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
                              <AlertDialogAction
                                className="rounded-xl bg-red-500 hover:bg-red-600 text-white"
                                onClick={() => deleteApp(app._id)}
                              >
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="px-5 pt-4 pb-0">
                    {/* Company */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: LIME_BG, border: `1px solid ${LIME_BD}` }}>
                        <Briefcase size={17} style={{ color: LIME }} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate leading-tight text-sm">{app.companyName}</p>
                        <p className="text-xs font-semibold truncate text-slate-400 mt-0.5">{app.position}</p>
                      </div>
                    </div>

                    {/* Source badge */}
                    {app.source && app.source !== "Lainnya" && (
                      <Badge variant="outline" className="text-[10px] font-semibold text-slate-400 border-slate-200 bg-slate-50 mb-3">
                        {app.source}
                      </Badge>
                    )}

                    {/* Notes preview */}
                    {app.notes && (
                      <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                        {app.notes}
                      </p>
                    )}

                    {/* Poster */}
                    {app.fotoPoster && (
                      <div className="mb-3 rounded-xl overflow-hidden border border-slate-100 aspect-video bg-slate-50">
                        <img src={app.fotoPoster} alt="Poster" className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Interview countdown */}
                    {app.interviewDate && days !== null && (
                      <div className={cn(
                        "flex items-center gap-2 text-xs font-bold rounded-xl px-3 py-2 mb-3",
                        days < 0 ? "bg-slate-50 text-slate-400 border border-slate-100" :
                          days === 0 ? "bg-red-50 text-red-600 border border-red-200" :
                            days === 1 ? "bg-orange-50 text-orange-600 border border-orange-200" :
                              "bg-amber-50 text-amber-600 border border-amber-200"
                      )}>
                        <Calendar size={13} />
                        {days < 0 ? `Wawancara sudah lewat` :
                          days === 0 ? `Wawancara HARI INI!` :
                            days === 1 ? `Wawancara BESOK — H-1` :
                              `Wawancara ${days} hari lagi`}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="px-5 pt-3 pb-5 border-t border-slate-50 mt-2 flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Calendar size={11} />
                      {new Date(app.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    {app.linkPostingan && (
                      <a href={app.linkPostingan} target="_blank" rel="noreferrer"
                        className="ml-auto flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-700 transition-colors">
                        <ExternalLink size={11} /> Link
                      </a>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}