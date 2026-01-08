import {useMutation, useQuery} from "@tanstack/react-query";
import {getStudentCourseProgress, changeStudentCourseProgress} from "./studentProgressCourseApi.ts";
import {getItem} from "../../utils/utils.ts";
import {useToast} from "../../hooks/useToast.tsx";

export const useGetStudentCourseProgress = (id: string | undefined) =>
    useQuery({
        queryKey: ["studentCourseId", id],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            if (!id) throw new Error("No courseId");

            return await getStudentCourseProgress(id);
        },
        retry: false,
        enabled: !!id,
    });

export const useChangeStudentCourseProgress = () => {
    const toast = useToast();
    return useMutation({
        mutationFn: changeStudentCourseProgress,
        onSuccess: async () => {

        },
        onError: (error) => {
            console.log(error);
            toast.error(error.message);
        },
    });
};

