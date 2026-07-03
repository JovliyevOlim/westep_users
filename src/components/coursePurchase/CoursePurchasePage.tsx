import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight, ShieldCheck } from "lucide-react";
import { CoursePurchaseCourse, CoursePurchaseModule } from "./types";
import { Badge } from "../../ui/Badge";
import { PurchaseModuleItem } from "../../ui/PurchaseModuleItem";

export type CoursePurchasePageProps = {
  courseId?: string;
  course: CoursePurchaseCourse;
  modules: CoursePurchaseModule[];
  withHeader?: boolean;
  HeaderComponent?: React.ComponentType;
  onSubmit?: (payload: { courseId: string }) => void;
  isSubmitting?: boolean;
};

export function CoursePurchasePage({
  courseId,
  course,
  modules: courseModules,
  withHeader = false,
  HeaderComponent,
  onSubmit,
  isSubmitting = false,
}: CoursePurchasePageProps) {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const subscriptionModulesCount = useMemo(
    () => courseModules.filter((module) => module.requiresSubscription && !module.unlocked).length,
    [courseModules],
  );

  const toggleExpand = (id: string) => {
    setExpandedModule(expandedModule === id ? null : id);
  };

  const handleSubmit = () => {
    if (!onSubmit) return;
    onSubmit({ courseId: courseId || course.id });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] transition-colors duration-500 selection:bg-blue-500/30 font-sans">
      {withHeader && HeaderComponent && <HeaderComponent />}

      <main className="max-w-[1300px] mx-auto px-4 sm:px-10 pt-12 sm:pt-16 pb-24 text-slate-900 dark:text-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          <div className="lg:col-span-7 space-y-12">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-[2px] w-8 bg-blue-600 rounded-full" />
                <Badge variant="blue">{course.category} • Professional Series</Badge>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.05] tracking-tight">
                {course.title}
              </h1>
              <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl">
                Yuqori darajadagi bilim va amaliy tajriba. Kurs doirasida barcha modullarni professional darajada o'zlashtiring.
              </p>
            </motion.div>

            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    O'quv rejasi
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Modullar va ularning ochilish shartlari</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {courseModules.map((module) => (
                  <PurchaseModuleItem
                    key={module.id}
                    module={module}
                    isExpanded={expandedModule === module.id}
                    onExpand={toggleExpand}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 rounded-[44px] border border-slate-200/50 dark:border-slate-800/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] p-8 sm:p-12 space-y-10 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />

              <div className="space-y-8 relative z-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Kursga yozilish</h3>
                  <Badge variant="blue">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      Secure
                    </div>
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tighter">
                    Yozilish bepul
                  </p>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-[0.1em] leading-relaxed">
                    {subscriptionModulesCount > 0
                      ? `${subscriptionModulesCount} ta modul obuna orqali ochiladi.`
                      : "Barcha modullar ochiq."}
                  </p>
                  {subscriptionModulesCount > 0 && (
                    <Link
                      to="/subscription"
                      className="inline-flex items-center gap-2 pt-1 text-[11px] font-black uppercase tracking-[0.15em] text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400"
                    >
                      Obuna tariflarini ko'rish
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>

              <div className="pt-6 relative z-10">
                <motion.button
                  whileHover={!isSubmitting ? { scale: 1.01, y: -2 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.99 } : {}}
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className={`w-full group py-6 rounded-[28px] transition-all flex items-center justify-center gap-4 px-8 ${!isSubmitting
                      ? 'bg-blue-600 text-white shadow-[0_24px_48px_-12px_rgba(37,99,235,0.35)] hover:bg-blue-700'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                    }`}
                >
                  <span className="text-[13px] font-bold uppercase tracking-[0.25em]">
                    {isSubmitting ? "Yuklanmoqda..." : 'Boshlash'}
                  </span>
                  {!isSubmitting && (
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1.5 transition-transform duration-300">
                      <ChevronRight className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.button>
                <div className="mt-8 flex items-center justify-center gap-4 opacity-40">
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End-to-End Encryption</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CoursePurchasePage;
