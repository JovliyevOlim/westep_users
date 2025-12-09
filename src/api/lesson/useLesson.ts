import {useQuery} from "@tanstack/react-query";
import {getLessonsById, getAllLessons} from "./lessonApi.ts";
import {getItem} from "../../utils/utils.ts";

export const useGetLessons = (moduleId: string | null) =>
    useQuery({
        queryKey: ["courses", moduleId],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            if (!moduleId) throw new Error("No courseId");

            return await getAllLessons(moduleId);
        },
        retry: false,
        enabled: !!moduleId,
    });

export const useGetLessonById = (id: string | null) =>
    useQuery({
        queryKey: ["lesson", id],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            return await getLessonsById(id);
        },
        retry: false,
        enabled: !!id
    });


