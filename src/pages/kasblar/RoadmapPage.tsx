import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getCoursePurchaseUrl } from "../../utils/coursePurchase.ts";
import { useMyRoadmaps } from "../../api/professions/useProfessions.ts";
import type { RoadmapItemViewDto } from "../../api/professions/types.ts";

function itemIcon(status: RoadmapItemViewDto["status"]) {
    if (status === "DONE") return "✅";
    if (status === "IN_PROGRESS") return "🔵";
    if (status === "AVAILABLE") return "▶️";
    return "🔒";
}

export default function RoadmapPage() {
    const navigate = useNavigate();
    const roadmapsQuery = useMyRoadmaps();
    const roadmaps = roadmapsQuery.data ?? [];

    return (
        <div className="min-h-[calc(100dvh-76px)] bg-[#F8FAFC] pb-24 dark:bg-slate-950">
            <div className="mx-auto max-w-[800px] space-y-6 px-4 pt-8 sm:px-10">
                <button
                    type="button"
                    onClick={() => navigate("/kasblar/mening")}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500"
                >
                    <ArrowLeft className="h-4 w-4" /> Orqaga
                </button>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Yo'l xaritam</h1>
                <p className="text-sm font-medium text-slate-500">Kasbingiz sari bosqichma-bosqich yo'l</p>

                {roadmapsQuery.isLoading ? (
                    <div className="h-40 animate-pulse rounded-3xl bg-white dark:bg-slate-900" />
                ) : roadmaps.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center text-sm font-bold text-slate-500">
                        Hali yo'l xaritangiz yo'q. Kasb tasdiqlanganda shu yerda paydo bo'ladi.
                    </div>
                ) : (
                    <div className="space-y-8">
                        {roadmaps.map((roadmap) => (
                            <section key={roadmap.id} className="space-y-4">
                                <div className="rounded-3xl bg-white p-5 dark:bg-slate-900">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">{roadmap.professionEmoji || "💼"}</span>
                                        <div className="flex-1">
                                            <div className="font-black text-slate-900 dark:text-white">
                                                {roadmap.professionTitle}
                                            </div>
                                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                                <div
                                                    className="h-full rounded-full bg-blue-600"
                                                    style={{ width: `${roadmap.overallProgressPercent}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="font-black text-blue-600">{roadmap.overallProgressPercent}%</div>
                                    </div>
                                </div>
                                {roadmap.stages.map((stage, stageIndex) => (
                                    <div key={`${roadmap.id}-${stage.orderIndex}`}>
                                        <div className="mb-2 flex items-center gap-2 font-black text-slate-900 dark:text-white">
                                            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs text-white ${stage.completed ? "bg-emerald-500" : "bg-slate-400"}`}>
                                                {stage.completed ? "✓" : stageIndex + 1}
                                            </span>
                                            {stage.name}
                                        </div>
                                        <div className="space-y-2 pl-9">
                                            {stage.items.map((item) => {
                                                const locked = item.status === "LOCKED" || item.itemType !== "COURSE" || !item.courseId;
                                                return (
                                                    <button
                                                        key={item.id}
                                                        type="button"
                                                        disabled={locked}
                                                        onClick={() => item.courseId && navigate(getCoursePurchaseUrl({ id: item.courseId }))}
                                                        className="flex w-full items-start gap-3 rounded-2xl bg-white p-4 text-left disabled:opacity-50 dark:bg-slate-900"
                                                    >
                                                        <span>{itemIcon(item.status)}</span>
                                                        <div>
                                                            <div className="font-bold text-slate-900 dark:text-white">
                                                                {item.title}
                                                                {!item.required ? " · ixtiyoriy" : ""}
                                                            </div>
                                                            {item.description ? (
                                                                <div className="mt-1 text-xs text-slate-500">{item.description}</div>
                                                            ) : null}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
