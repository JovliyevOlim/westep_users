import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { getCoursePurchaseUrl } from "../../utils/coursePurchase.ts";
import {
    useMyProfessions,
    useProfessionDetail,
    useSelectProfession,
} from "../../api/professions/useProfessions.ts";

export default function KasbDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const detailQuery = useProfessionDetail(slug);
    const myQuery = useMyProfessions();
    const selectMutation = useSelectProfession();

    const profession = detailQuery.data;
    const mine = (myQuery.data ?? []).find(
        (item) => item.professionId === profession?.id && item.status !== "ABANDONED",
    );

    if (detailQuery.isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-sm font-bold text-slate-500">
                Yuklanmoqda...
            </div>
        );
    }

    if (!profession || detailQuery.isError) {
        return (
            <div className="mx-auto max-w-lg px-6 py-20 text-center">
                <p className="text-lg font-black text-slate-900 dark:text-white">
                    {detailQuery.error instanceof Error ? detailQuery.error.message : "Kasb topilmadi"}
                </p>
                <button type="button" onClick={() => navigate("/kasblar")} className="mt-6 font-bold text-blue-600">
                    Kasblarga qaytish
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100dvh-76px)] bg-[#F8FAFC] pb-24 dark:bg-slate-950">
            <div className="mx-auto max-w-[900px] space-y-8 px-4 pt-8 sm:px-10">
                <button
                    type="button"
                    onClick={() => navigate("/kasblar")}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600"
                >
                    <ArrowLeft className="h-4 w-4" /> Orqaga
                </button>

                <div className="rounded-[32px] border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                    <div className="flex items-start gap-4">
                        <div
                            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl text-white"
                            style={{
                                background: `linear-gradient(135deg, ${profession.grad?.from || "#0A5EFA"}, ${profession.grad?.to || "#0843B8"})`,
                            }}
                        >
                            {profession.emoji}
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                                {profession.fieldLabel}
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white">{profession.title}</h1>
                            <p className="mt-2 text-slate-500 dark:text-slate-400">{profession.tagline}</p>
                            <div className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:bg-blue-600/10">
                                {profession.demand}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        {mine ? (
                            <Link
                                to="/kasblar/mening"
                                className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-100 py-3.5 text-sm font-black text-slate-800 dark:bg-slate-800 dark:text-white"
                            >
                                {mine.status === "CONFIRMED"
                                    ? "Tanlangan va tasdiqlangan"
                                    : mine.status === "RESELECTING"
                                      ? "Qayta tanlash tavsiya etilgan"
                                      : "Tanlangan — ko'rib chiqilmoqda"}
                            </Link>
                        ) : (
                            <button
                                type="button"
                                disabled={selectMutation.isPending}
                                onClick={() => selectMutation.mutate({ professionId: profession.id, source: "FREE" })}
                                className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 py-3.5 text-sm font-black text-white disabled:opacity-60"
                            >
                                {selectMutation.isPending ? "Saqlanmoqda..." : "Bu kasbni tanlayman"}
                            </button>
                        )}
                        {selectMutation.isError ? (
                            <p className="mt-2 text-center text-xs font-bold text-red-500">
                                {selectMutation.error instanceof Error
                                    ? selectMutation.error.message
                                    : "Kasbni tanlab bo'lmadi"}
                            </p>
                        ) : null}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white p-4 dark:bg-slate-900">
                        <div className="text-xs font-bold uppercase tracking-widest text-slate-400">O'rganish</div>
                        <div className="mt-1 font-black text-slate-900 dark:text-white">{profession.duration}</div>
                    </div>
                    <div className="rounded-2xl bg-white p-4 dark:bg-slate-900">
                        <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Daraja</div>
                        <div className="mt-1 font-black text-slate-900 dark:text-white">{profession.level}</div>
                    </div>
                </div>

                <section className="rounded-[28px] bg-white p-6 dark:bg-slate-900">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">Kasb haqida</h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{profession.description}</p>
                </section>

                {profession.skills?.length > 0 ? (
                    <section>
                        <h2 className="mb-3 text-lg font-black text-slate-900 dark:text-white">Kerakli ko'nikmalar</h2>
                        <div className="flex flex-wrap gap-2">
                            {profession.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                ) : null}

                {profession.roles?.length > 0 ? (
                    <section className="rounded-[28px] bg-white p-6 dark:bg-slate-900">
                        <h2 className="text-lg font-black text-slate-900 dark:text-white">Qanday ishlar</h2>
                        <ul className="mt-3 space-y-2">
                            {profession.roles.map((role) => (
                                <li key={role} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                                    {role}
                                </li>
                            ))}
                        </ul>
                    </section>
                ) : null}

                {profession.courses?.length > 0 ? (
                    <section>
                        <h2 className="mb-3 text-lg font-black text-slate-900 dark:text-white">Tavsiya etilgan kurslar</h2>
                        <div className="space-y-3">
                            {profession.courses.map((course) => (
                                <Link
                                    key={course.id}
                                    to={getCoursePurchaseUrl({ id: course.id })}
                                    className="block rounded-2xl border border-slate-100 bg-white p-4 transition hover:border-blue-200 dark:border-slate-800 dark:bg-slate-900"
                                >
                                    <div className="font-black text-slate-900 dark:text-white">{course.name}</div>
                                    <div className="mt-1 text-xs font-bold text-slate-400">
                                        {course.categoryLabel}
                                        {course.teacherFullName ? ` · ${course.teacherFullName}` : ""}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                ) : null}
            </div>
        </div>
    );
}
