import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    addLessonProgressStart,
    getLessonProgress,
    getLessonProgressList,
    updateLessonProgress,
} from "./lessonProgressApi.ts";
import {getItem} from "../../utils/utils.ts";

export const useGetLessonsProgress = ({studentCourseId, lessonId, ended}: {
    studentCourseId: string | undefined,
    lessonId: string | undefined,
    ended: boolean
}) =>
    useQuery({
        queryKey: ["lessonProgress", lessonId, ended],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            if (!lessonId) throw new Error("No courseId");

            return await getLessonProgress({studentCourseId, lessonId});
        },
        retry: false,
        enabled: !!lessonId,
    });

export const useGetLessonsProgressList = (studentCourseId: string | undefined) =>
    useQuery({
        queryKey: ["lessonsProgressList", studentCourseId],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            if (!studentCourseId) throw new Error("No courseId");

            return await getLessonProgressList({studentCourseId});
        },
        retry: false,
        enabled: !!studentCourseId,
    });

export const useStartLessonProgress = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: addLessonProgressStart,
        onSuccess: async () => {
            qc.invalidateQueries({queryKey: ["lessonsProgressList"]});
        },
        onError: (error) => {
            alert(error);
        },
    });
};

export const useUpdateLessonProgress = () => {
    return useMutation({
        mutationFn: updateLessonProgress,
        onSuccess: async () => {
        },
        onError: (error) => {
            alert(error);
        },
    });
};
