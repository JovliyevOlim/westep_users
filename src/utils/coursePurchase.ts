import type { Course } from "../types/types.ts";
import { isSafeInternalRedirect } from "./postAuthRedirect.ts";

function getSafeInternalPath(url: string) {
    if (isSafeInternalRedirect(url)) {
        return url;
    }

    if (typeof window === "undefined") {
        return null;
    }

    try {
        const parsedUrl = new URL(url, window.location.origin);
        if (parsedUrl.origin !== window.location.origin) {
            return null;
        }

        const internalPath = `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
        return isSafeInternalRedirect(internalPath) ? internalPath : null;
    } catch {
        return null;
    }
}

export function getCoursePurchaseUrl(course: Pick<Course, "id" | "buyCourseUrl">) {
    const safeBuyCourseUrl = course.buyCourseUrl ? getSafeInternalPath(course.buyCourseUrl) : null;

    if (safeBuyCourseUrl) {
        return safeBuyCourseUrl;
    }

    const encodedCourseId = encodeURIComponent(course.id);
    return `/buy-course?courseId=${encodedCourseId}`;
}
