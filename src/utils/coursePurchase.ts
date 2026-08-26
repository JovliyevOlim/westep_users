import type { Course } from "../types/types.ts";

/** Mobil kabi: kurs sahifasi enroll + obuna, savat/xarid yo'q. */
export function getCoursePurchaseUrl(course: Pick<Course, "id">) {
    return `/course-purchase/${encodeURIComponent(course.id)}`;
}
