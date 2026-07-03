export interface CoursePurchaseLesson {
    id: string;
    title: string;
    duration: string;
}

export interface CoursePurchaseModule {
    id: string;
    title: string;
    requiresSubscription?: boolean;
    unlocked?: boolean;
    lessons: CoursePurchaseLesson[];
}

export interface CoursePurchaseCourse {
    id: string;
    title: string;
    category: string;
}

export interface CoursePurchaseData {
    courseId: string;
    course: CoursePurchaseCourse;
    modules: CoursePurchaseModule[];
}
