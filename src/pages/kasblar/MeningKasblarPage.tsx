import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAbandonProfession, useMyProfessions } from "../../api/professions/useProfessions.ts";
import type { StudentProfessionDto } from "../../api/professions/types.ts";

const STATUS_META: Record<StudentProfessionDto["status"], { label: string; className: string }> = {
    UNDER_REVIEW: { label: "Ko'rib chiqilmoqda", className: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300" },
    CONFIRMED: { label: "Tasdiqlangan", className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" },
    RESELECTING: { label: "Qayta tanlash tavsiya etildi", className: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300" },
    COMPLETED: { label: "Yakunlangan", className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" },
    ABANDONED: { label: "Voz kechilgan", className: "bg-slate-100 text-slate-500" },
};

export default function MeningKasblarPage() {
    const navigate = useNavigate();
    const myQuery = useMyProfessions();
    const abandonMutation = useAbandonProfession();
    const items = (myQuery.data ?? []).filter((item) => item.status !== "ABANDONED");

    return (
        <div className="min-h-[calc(100dvh-76px)] bg-[#F8FAFC] pb-24 dark:bg-slate-950">
            <div className="mx-auto max-w-[800px] space-y-6 px-4 pt-8 sm:px-10">
                <button
                    type="button"
                    onClick={() => navigate("/kasblar")}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500"
                >
                    <ArrowLeft className="h-4 w-4" /> Orqaga
                </button>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Mening kasblarim</h1>
                <p className="text-sm font-medium text-slate-500">Tanlagan yo'nalishlaringiz va holati</p>

                {myQuery.isLoading ? (
                    <div className="h-32 animate-pulse rounded-3xl bg-white dark:bg-slate-900" />
                ) : items.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center text-sm font-bold text-slate-500">
                        Hali kasb tanlamagansiz. Avval qiziqish testidan o'ting.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {items.map((item) => {
                            const meta = STATUS_META[item.status];
                            return (
                                <div
                                    key={item.id}
                                    className="rounded-3xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                                >
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/kasblar/${item.slug}`)}
                                        className="flex w-full items-center gap-3 text-left"
                                    >
                                        <span className="text-3xl">{item.emoji || "💼"}</span>
                                        <div>
                                            <div className="font-black text-slate-900 dark:text-white">{item.title}</div>
                                            <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${meta.className}`}>
                                                {meta.label}
                                            </span>
                                        </div>
                                    </button>
                                    {item.status === "CONFIRMED" || item.status === "COMPLETED" ? (
                                        <Link
                                            to="/kasblar/roadmap"
                                            className="mt-4 inline-flex rounded-xl bg-slate-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-800 dark:bg-slate-800 dark:text-white"
                                        >
                                            Yo'l xaritasi
                                        </Link>
                                    ) : null}
                                    {item.status === "UNDER_REVIEW" || item.status === "CONFIRMED" || item.status === "RESELECTING" ? (
                                        <button
                                            type="button"
                                            disabled={abandonMutation.isPending}
                                            onClick={() => abandonMutation.mutate(item.id)}
                                            className="mt-4 text-xs font-black uppercase tracking-widest text-slate-400"
                                        >
                                            Voz kechish
                                        </button>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                )}

                <Link
                    to="/kasblar/test"
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 py-3.5 text-sm font-black text-white"
                >
                    Qiziqish testidan o'tish
                </Link>
            </div>
        </div>
    );
}
