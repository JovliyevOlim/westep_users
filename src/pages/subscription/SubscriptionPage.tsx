import { useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    BadgeCheck,
    CalendarClock,
    Check,
    CreditCard,
    Loader2,
    Sparkles,
    Trash2,
    X,
} from "lucide-react";
import { Badge } from "../../ui/Badge";
import { useToast } from "../../hooks/useToast.tsx";
import {
    useCancelSubscription,
    useChangeSubscriptionPlan,
    useGetMyCard,
    useGetMySubscription,
    useGetSubscriptionPlans,
    useRemoveMyCard,
    useSaveCardToken,
    useSubscribeToPlan,
} from "../../api/subscription/useSubscription.ts";
import {
    createPaymeCard,
    requestPaymeCardCode,
    verifyPaymeCard,
} from "../../api/subscription/paymeCardClient.ts";
import type { Subscription, SubscriptionPlan } from "../../api/subscription/subscriptionApi.ts";

function formatPrice(price?: number | null) {
    if (!price) return "0 so'm";
    return `${price.toLocaleString("uz-UZ")} so'm`;
}

function formatDate(value?: string | null) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("uz-UZ", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatCardNumberInput(value: string) {
    return value
        .replace(/\D/g, "")
        .slice(0, 16)
        .replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiryInput(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

const statusBadges: Record<Subscription["status"], { label: string; variant: "emerald" | "yellow" | "slate" | "blue" }> = {
    ACTIVE: { label: "Faol", variant: "emerald" },
    PAST_DUE: { label: "To'lov kutilmoqda", variant: "yellow" },
    CANCELLED: { label: "Bekor qilingan", variant: "slate" },
    EXPIRED: { label: "Muddati tugagan", variant: "slate" },
};

type CardModalStep = "card" | "code";

function AddCardModal({ onClose }: { onClose: () => void }) {
    const toast = useToast();
    const { mutateAsync: saveToken } = useSaveCardToken();

    const [step, setStep] = useState<CardModalStep>("card");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [code, setCode] = useState("");
    const [phone, setPhone] = useState<string | null>(null);
    const [paymeToken, setPaymeToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleCardSubmit(event: FormEvent) {
        event.preventDefault();
        const number = cardNumber.replace(/\s/g, "");
        const expire = expiry.replace(/\D/g, "");

        if (number.length !== 16 || expire.length !== 4) {
            toast.error("Karta ma'lumotlari noto'g'ri", "Karta raqami 16 ta, muddat MM/YY formatida bo'lishi kerak");
            return;
        }

        setIsLoading(true);
        try {
            const card = await createPaymeCard({ number, expire });
            const verifyInfo = await requestPaymeCardCode(card.token);
            setPaymeToken(card.token);
            setPhone(verifyInfo.phone || null);
            setStep("code");
        } catch (error) {
            toast.error("Karta qo'shilmadi", (error as Error).message);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCodeSubmit(event: FormEvent) {
        event.preventDefault();
        if (!paymeToken || code.replace(/\D/g, "").length < 4) {
            return;
        }

        setIsLoading(true);
        try {
            const card = await verifyPaymeCard({ token: paymeToken, code: code.trim() });
            await saveToken({
                paymeToken: card.token,
                maskedPan: card.number,
                expiry: card.expire.replace(/\D/g, ""),
            });
            toast.success("Karta saqlandi", card.number);
            onClose();
        } catch (error) {
            toast.error("Tasdiqlanmadi", (error as Error).message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.98 }}
                className="fixed left-1/2 top-1/2 z-[90] w-[min(100vw-2rem,26rem)] -translate-x-1/2 -translate-y-1/2 rounded-[32px] border border-slate-200/60 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            >
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-black uppercase italic tracking-tight text-slate-900 dark:text-white">
                        {step === "card" ? "Karta qo'shish" : "SMS tasdiqlash"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-slate-100 p-2 text-slate-500 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                        type="button"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {step === "card" ? (
                    <form onSubmit={handleCardSubmit} className="space-y-4">
                        <div>
                            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                Karta raqami
                            </label>
                            <input
                                value={cardNumber}
                                onChange={(e) => setCardNumber(formatCardNumberInput(e.target.value))}
                                placeholder="8600 0000 0000 0000"
                                inputMode="numeric"
                                autoComplete="cc-number"
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-bold tracking-widest text-slate-900 outline-none transition-all focus:border-blue-500/40 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                Amal qilish muddati
                            </label>
                            <input
                                value={expiry}
                                onChange={(e) => setExpiry(formatExpiryInput(e.target.value))}
                                placeholder="MM/YY"
                                inputMode="numeric"
                                autoComplete="cc-exp"
                                className="w-32 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-bold tracking-widest text-slate-900 outline-none transition-all focus:border-blue-500/40 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            />
                        </div>
                        <p className="text-[11px] font-medium leading-relaxed text-slate-400">
                            Karta ma'lumotlari Payme'ga to'g'ridan-to'g'ri yuboriladi va bizning serverda saqlanmaydi.
                        </p>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 py-4 text-[12px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-blue-700 disabled:opacity-60"
                        >
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            SMS kod olish
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleCodeSubmit} className="space-y-4">
                        <p className="text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                            {phone ? `${phone} raqamiga` : "Karta egasining telefoniga"} yuborilgan tasdiqlash kodini kiriting.
                        </p>
                        <input
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            placeholder="••••••"
                            inputMode="numeric"
                            autoFocus
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-2xl font-black tracking-[0.5em] text-slate-900 outline-none transition-all focus:border-blue-500/40 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 py-4 text-[12px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-blue-700 disabled:opacity-60"
                        >
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            Tasdiqlash
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep("card")}
                            className="w-full py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            Boshqa karta kiritish
                        </button>
                    </form>
                )}
            </motion.div>
        </>
    );
}

export default function SubscriptionPage() {
    const toast = useToast();
    const { data: plans = [], isPending: isPlansPending } = useGetSubscriptionPlans();
    const { data: subscription } = useGetMySubscription();
    const { data: card } = useGetMyCard();

    const { mutate: subscribe, isPending: isSubscribePending } = useSubscribeToPlan();
    const { mutate: changePlan, isPending: isChangePending } = useChangeSubscriptionPlan();
    const { mutate: cancel, isPending: isCancelPending } = useCancelSubscription();
    const { mutate: removeCard, isPending: isRemovePending } = useRemoveMyCard();

    const [isCardModalOpen, setIsCardModalOpen] = useState(false);

    const sortedPlans = useMemo(
        () => [...plans].sort((a, b) => (a.tier ?? 0) - (b.tier ?? 0)),
        [plans],
    );

    const hasActiveCard = card?.status === "ACTIVE";
    const canChangePlan = subscription?.status === "ACTIVE" || subscription?.status === "PAST_DUE";
    const statusBadge = subscription ? statusBadges[subscription.status] : null;

    function handlePlanAction(plan: SubscriptionPlan) {
        if (!hasActiveCard) {
            toast.info("Avval karta qo'shing", "Obuna to'lovi saqlangan kartadan yechiladi");
            setIsCardModalOpen(true);
            return;
        }

        const onError = (error: Error) => toast.error("Amal bajarilmadi", error.message);

        if (canChangePlan) {
            changePlan(plan.id, {
                onSuccess: () => toast.success("Tarif o'zgartirildi", plan.name),
                onError,
            });
            return;
        }

        subscribe(plan.id, {
            onSuccess: () => toast.success("Obuna faollashdi", plan.name),
            onError,
        });
    }

    function handleCancel() {
        cancel(undefined, {
            onSuccess: (data) =>
                toast.success("Obuna bekor qilindi", `Kurslar ${formatDate(data.currentPeriodEnd)} gacha ochiq qoladi`),
            onError: (error) => toast.error("Amal bajarilmadi", (error as Error).message),
        });
    }

    function handleRemoveCard() {
        removeCard(undefined, {
            onSuccess: () => toast.success("Karta o'chirildi"),
            onError: (error) => toast.error("Amal bajarilmadi", (error as Error).message),
        });
    }

    const isPlanActionPending = isSubscribePending || isChangePending;

    return (
        <div className="min-h-[calc(100dvh-76px)] bg-[#F8FAFC] font-sans transition-colors duration-500 dark:bg-[#020617]">
            <main className="mx-auto max-w-[1300px] px-4 pb-24 pt-12 text-slate-900 dark:text-slate-100 sm:px-10 sm:pt-16">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="h-[2px] w-8 rounded-full bg-blue-600" />
                        <Badge variant="blue">
                            <span className="flex items-center gap-2">
                                <Sparkles className="h-3.5 w-3.5" />
                                Premium Access
                            </span>
                        </Badge>
                    </div>
                    <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                        Obuna orqali barcha modullarni oching
                    </h1>
                    <p className="max-w-2xl text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                        Bitta obuna — platformadagi barcha premium modullarga to'liq kirish. To'lov har oy saqlangan kartadan avtomatik yechiladi.
                    </p>
                </motion.div>

                <div className="mt-12 grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
                    <div className="space-y-6 lg:col-span-7">
                        {isPlansPending ? (
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className="h-80 animate-pulse rounded-[32px] border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900" />
                                ))}
                            </div>
                        ) : !sortedPlans.length ? (
                            <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center text-sm font-bold text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                                Hozircha obuna tariflari mavjud emas.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                {sortedPlans.map((plan) => {
                                    const isCurrentPlan = subscription?.plan?.id === plan.id && canChangePlan;

                                    return (
                                        <motion.div
                                            key={plan.id}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`relative flex flex-col justify-between overflow-hidden rounded-[32px] border p-8 transition-all ${isCurrentPlan
                                                ? "border-blue-500/50 bg-white shadow-xl shadow-blue-500/10 dark:bg-slate-900"
                                                : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                                                }`}
                                        >
                                            <div className="space-y-5">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-black uppercase italic tracking-tight text-slate-900 dark:text-white">
                                                        {plan.name}
                                                    </h3>
                                                    {isCurrentPlan && <Badge variant="blue">Joriy</Badge>}
                                                </div>

                                                <div>
                                                    <p className="text-3xl font-extrabold tracking-tighter text-slate-900 dark:text-white">
                                                        {formatPrice(plan.monthlyPrice)}
                                                    </p>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                                        har oy
                                                    </p>
                                                </div>

                                                {plan.description && (
                                                    <p className="text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                                                        {plan.description}
                                                    </p>
                                                )}

                                                {!!plan.features?.length && (
                                                    <ul className="space-y-2.5">
                                                        {plan.features.map((feature) => (
                                                            <li key={feature} className="flex items-start gap-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-300">
                                                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                                                {feature}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>

                                            <button
                                                type="button"
                                                disabled={isCurrentPlan || isPlanActionPending}
                                                onClick={() => handlePlanAction(plan)}
                                                className={`mt-8 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${isCurrentPlan
                                                    ? "cursor-default border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                                    : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                                                    }`}
                                            >
                                                {isPlanActionPending && !isCurrentPlan && (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                )}
                                                {isCurrentPlan
                                                    ? "Joriy tarif"
                                                    : canChangePlan
                                                        ? "Tarifga o'tish"
                                                        : "Obuna bo'lish"}
                                            </button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="h-fit space-y-6 lg:sticky lg:top-32 lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="rounded-[32px] border border-slate-200/60 bg-white p-8 shadow-sm dark:border-slate-800/60 dark:bg-slate-900"
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                                    <BadgeCheck className="h-4 w-4 text-blue-600" />
                                    Mening obunam
                                </h3>
                                {statusBadge && <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>}
                            </div>

                            {subscription ? (
                                <div className="space-y-5">
                                    <div>
                                        <p className="text-2xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white">
                                            {subscription.plan?.name}
                                        </p>
                                        <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">
                                            {formatPrice(subscription.plan?.monthlyPrice)} / oy
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                                        <CalendarClock className="h-5 w-5 shrink-0 text-blue-600" />
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                                                {subscription.status === "CANCELLED" ? "Ochiq qoladi" : "Keyingi to'lov"}
                                            </p>
                                            <p className="text-sm font-black text-slate-900 dark:text-white">
                                                {formatDate(subscription.currentPeriodEnd)}
                                            </p>
                                        </div>
                                    </div>

                                    {canChangePlan && (
                                        <button
                                            type="button"
                                            disabled={isCancelPending}
                                            onClick={handleCancel}
                                            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-60 dark:border-slate-700 dark:hover:border-red-900 dark:hover:bg-red-950/30"
                                        >
                                            {isCancelPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                                            Obunani bekor qilish
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                                    Sizda hozircha faol obuna yo'q. Tarifni tanlab obuna bo'ling — barcha premium modullar ochiladi.
                                </p>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="rounded-[32px] border border-slate-200/60 bg-white p-8 shadow-sm dark:border-slate-800/60 dark:bg-slate-900"
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                                    <CreditCard className="h-4 w-4 text-blue-600" />
                                    To'lov kartasi
                                </h3>
                                {hasActiveCard && <Badge variant="emerald">Faol</Badge>}
                            </div>

                            {hasActiveCard && card ? (
                                <div className="space-y-5">
                                    <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 p-5 text-white dark:from-blue-950 dark:to-slate-900">
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60">
                                            Saqlangan karta
                                        </p>
                                        <p className="mt-3 text-lg font-black tracking-[0.15em]">
                                            {card.maskedPan}
                                        </p>
                                        <p className="mt-1 text-[11px] font-bold tracking-widest opacity-70">
                                            {card.cardExpiry}
                                        </p>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsCardModalOpen(true)}
                                            className="flex-1 rounded-2xl border border-slate-200 py-3.5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-600 transition-all hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                        >
                                            Almashtirish
                                        </button>
                                        <button
                                            type="button"
                                            disabled={isRemovePending}
                                            onClick={handleRemoveCard}
                                            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3.5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-60 dark:border-slate-700 dark:hover:border-red-900 dark:hover:bg-red-950/30"
                                        >
                                            {isRemovePending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    <p className="text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                                        Obuna to'lovi uchun Humo yoki Uzcard kartangizni qo'shing. Karta Payme orqali xavfsiz saqlanadi.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setIsCardModalOpen(true)}
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                                    >
                                        <CreditCard className="h-4 w-4" />
                                        Karta qo'shish
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {isCardModalOpen && <AddCardModal onClose={() => setIsCardModalOpen(false)} />}
            </AnimatePresence>
        </div>
    );
}
