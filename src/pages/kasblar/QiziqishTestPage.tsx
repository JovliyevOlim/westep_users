import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useInterestQuiz, useSubmitInterestQuiz } from "../../api/professions/useProfessions.ts";
import type { InterestQuizResultDto } from "../../api/professions/types.ts";

export default function QiziqishTestPage() {
    const navigate = useNavigate();
    const quizQuery = useInterestQuiz();
    const submitMutation = useSubmitInterestQuiz();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [result, setResult] = useState<InterestQuizResultDto | null>(null);

    const questions = useMemo(() => quizQuery.data?.questions ?? [], [quizQuery.data]);
    const current = questions[currentIndex];
    const progress = questions.length > 0 ? Math.round((currentIndex / questions.length) * 100) : 0;

    const handlePick = async (optionId: string) => {
        if (!current) return;
        const nextAnswers = { ...answers, [current.id]: optionId };
        setAnswers(nextAnswers);
        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(currentIndex + 1);
            return;
        }
        try {
            const submitted = await submitMutation.mutateAsync(
                Object.entries(nextAnswers).map(([questionId, picked]) => ({
                    questionId,
                    optionId: picked,
                })),
            );
            setResult(submitted);
        } catch {
            setCurrentIndex(questions.length - 1);
        }
    };

    return (
        <div className="min-h-[calc(100dvh-76px)] bg-[#F8FAFC] pb-24 dark:bg-slate-950">
            <div className="mx-auto max-w-[720px] space-y-6 px-4 pt-8 sm:px-10">
                <button
                    type="button"
                    onClick={() => navigate("/kasblar")}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500"
                >
                    <ArrowLeft className="h-4 w-4" /> Orqaga
                </button>

                {quizQuery.isLoading ? (
                    <div className="py-20 text-center text-sm font-bold text-slate-500">Yuklanmoqda...</div>
                ) : quizQuery.isError || questions.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center text-sm font-bold text-slate-500">
                        Test hozircha tayyor emas. Savollar tez orada qo'shiladi.
                    </div>
                ) : result ? (
                    <div className="space-y-5">
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Natijangiz tayyor</h1>
                        {(result.fieldScores ?? []).slice(0, 3).map((field, index) => (
                            <div key={field.fieldKey} className="rounded-3xl bg-white p-5 dark:bg-slate-900">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-black text-blue-600">{index + 1}</div>
                                        <div className="font-black text-slate-900 dark:text-white">{field.fieldLabel}</div>
                                    </div>
                                    <div className="text-lg font-black text-blue-600">{field.score}%</div>
                                </div>
                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                    <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.min(100, field.score)}%` }} />
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => navigate("/kasblar")}
                            className="w-full rounded-2xl bg-blue-600 py-3.5 text-sm font-black text-white"
                        >
                            Kasblarni ko'rish
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setResult(null);
                                setAnswers({});
                                setCurrentIndex(0);
                            }}
                            className="w-full text-sm font-bold text-slate-500"
                        >
                            Testni qayta topshirish
                        </button>
                    </div>
                ) : (
                    <div className="space-y-5">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Qiziqish testi</h1>
                            <p className="mt-1 text-sm font-medium text-slate-500">
                                {currentIndex + 1} / {questions.length} savol
                            </p>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                            <div className="h-full rounded-full bg-blue-600" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="rounded-3xl bg-white p-6 dark:bg-slate-900">
                            <p className="text-lg font-black text-slate-900 dark:text-white">{current.text}</p>
                        </div>
                        <div className="space-y-3">
                            {current.options.map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    disabled={submitMutation.isPending}
                                    onClick={() => void handlePick(option.id)}
                                    className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-4 text-left font-bold text-slate-800 transition hover:border-blue-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                >
                                    {option.emoji ? <span className="text-xl">{option.emoji}</span> : null}
                                    {option.text}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
