export type MarketingPlanKey = "start" | "standard" | "premium";

export type MarketingFeature = {
  label: string;
  included: boolean;
};

type PlanLike = {
  slug?: string | null;
  name?: string | null;
  tier?: number | null;
};

const CATALOG: Record<
  MarketingPlanKey,
  { name: string; note: string; popular: boolean; features: MarketingFeature[] }
> = {
  start: {
    name: "Start",
    note: "3 ta kurs. Ota-ona tanlaydi.",
    popular: false,
    features: [
      { label: "3 ta kurs (ota-ona tanlaydi)", included: true },
      { label: "Ilovada bepul darslar", included: true },
      { label: "Asosiy statistika", included: true },
      { label: "Qisqa darslar — xorij metodikasi", included: true },
      { label: "Kasb yo'li to'liq emas", included: false },
      { label: "Ota-ona paneli to'liq emas", included: false },
    ],
  },
  standard: {
    name: "Standart",
    note: "Ko'proq fanlar + ota-ona paneli",
    popular: true,
    features: [
      { label: "Ko'proq maktab fanlari", included: true },
      { label: "Ota-ona paneli", included: true },
      { label: "Ekran vaqti chegarasi", included: true },
      { label: "Kasb yo'li — qisman", included: true },
      { label: "Sertifikatlar va yutuqlar", included: true },
      { label: "Cheklanmagan o'qish vaqti", included: true },
    ],
  },
  premium: {
    name: "Premium",
    note: "Barcha fanlar + to'liq kasb yo'li",
    popular: false,
    features: [
      { label: "Barcha fanlar ochiq", included: true },
      { label: "To'liq kasb yo'l xaritalari", included: true },
      { label: "Barcha kurslar obunada", included: true },
      { label: "To'liq ota-ona paneli", included: true },
      { label: "3 ta bola profili", included: true },
      { label: "Haftalik Telegram hisobot", included: true },
    ],
  },
};

function normalize(value?: string | null) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/ʻ/g, "'")
    .replace(/’/g, "'");
}

export function resolveMarketingPlanKey(plan: PlanLike): MarketingPlanKey | null {
  const slug = normalize(plan.slug);
  const name = normalize(plan.name);

  if (slug === "start" || name.includes("start")) return "start";
  if (
    slug === "standard" ||
    slug === "standart" ||
    name.includes("standart") ||
    name.includes("standard") ||
    name.includes("стандарт")
  ) {
    return "standard";
  }
  if (slug === "premium" || name.includes("premium") || name.includes("премиум")) {
    return "premium";
  }
  if (plan.tier === 1) return "start";
  if (plan.tier === 2) return "standard";
  if (plan.tier === 3) return "premium";
  return null;
}

export function getPlanMarketing(plan: PlanLike) {
  const key = resolveMarketingPlanKey(plan);
  return key ? CATALOG[key] : null;
}
