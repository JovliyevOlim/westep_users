import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, Compass, Search, Sparkles, Star } from "lucide-react";
import { useProfessionFields, useProfessionsList } from "../../api/professions/useProfessions.ts";

function useDebouncedValue<T>(value: T, delayMs = 300) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(id);
    }, [value, delayMs]);
    return debounced;
}

export default function KasblarPage() {
    const navigate = useNavigate();
    const [q, setQ] = useState("");
    const [field, setField] = useState("all");
    const debouncedQ = useDebouncedValue(q);

    const fieldsQuery = useProfessionFields();
    const listQuery = useProfessionsList({ field, q: debouncedQ });

    const chips = useMemo(() => {
        const fromApi = fieldsQuery.data?.fields ?? [];
        return [{ key: "all", label: "Barchasi" }, ...fromApi];
    }, [fieldsQuery.data]);

    const items = listQuery.data?.items ?? [];

    return (
        <div className="min-h-[calc(100dvh-76px)] bg-[#F8FAFC] pb-24 dark:bg-slate-950">
            <div className="mx-auto max-w-[1300px] space-y-8 px-4 pt-10 sm:px-10 sm:pt-14">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-blue-600 dark:bg-blue-600/10 dark:text-blue-400">
                        <Briefcase className="h-3.5 w-3.5" />
                        Kasb yo'li
                    </div>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white sm:text-5xl">
                        Kasbni tanlang
                    </h1>
                    <p className="max-w-xl text-base font-medium text-slate-500 dark:text-slate-400">
                        Yo'nalishni ko'ring, qiziqish testidan o'ting va shu kasbga yetaklovchi kurslarni boshlang.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Link
                        to="/kasblar/test"
                        className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-5 py-4 font-extrabold text-slate-900 shadow-sm transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                    >
                        <Compass className="h-5 w-5 text-blue-600" />
                        Qiziqish testi
                    </Link>
                    <Link
                        to="/kasblar/mening"
                        className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-5 py-4 font-extrabold text-slate-900 shadow-sm transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                    >
                        <Star className="h-5 w-5 text-amber-500" />
                        Mening kasblarim
                    </Link>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Kasb qidirish..."
                            className="w-full rounded-2xl border border-slate-100 bg-white py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {chips.map((chip) => (
                            <button
                                key={chip.key}
                                type="button"
                                onClick={() => setField(chip.key)}
                                className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest transition ${
                                    field === chip.key
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-slate-500 ring-1 ring-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800"
                                }`}
                            >
                                {chip.label}
                            </button>
                        ))}
                    </div>
                </div>

                {listQuery.isLoading ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-44 animate-pulse rounded-[28px] bg-white dark:bg-slate-900" />
                        ))}
                    </div>
                ) : listQuery.isError ? (
                    <div className="rounded-[28px] border border-dashed border-slate-300 p-10 text-center text-sm font-bold text-slate-500 dark:border-slate-700">
                        {listQuery.error instanceof Error ? listQuery.error.message : "Kasblarni yuklab bo'lmadi"}
                    </div>
                ) : items.length === 0 ? (
                    <div className="rounded-[28px] border border-dashed border-slate-300 p-10 text-center text-sm font-bold text-slate-500 dark:border-slate-700">
                        Bu so'rov bo'yicha kasb topilmadi.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((p) => (
                            <motion.button
                                key={p.id}
                                type="button"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => navigate(`/kasblar/${p.slug}`)}
                                className="rounded-[28px] border border-slate-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                            >
                                <div className="mb-3 flex items-center gap-3">
                                    <div
                                        className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl text-white"
                                        style={{
                                            background: `linear-gradient(135deg, ${p.grad?.from || "#0A5EFA"}, ${p.grad?.to || "#0843B8"})`,
                                        }}
                                    >
                                        {p.emoji || "💼"}
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                                            {p.fieldLabel}
                                        </div>
                                        <h2 className="text-lg font-black text-slate-900 dark:text-white">{p.title}</h2>
                                    </div>
                                </div>
                                <p className="line-clamp-2 text-sm font-medium text-slate-500 dark:text-slate-400">{p.tagline}</p>
                                <div className="mt-4 flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                                    <span>{p.demand}</span>
                                    <span className="inline-flex items-center gap-1 text-blue-600">
                                        <Sparkles className="h-3.5 w-3.5" />
                                        {p.courseCount} kurs
                                    </span>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
