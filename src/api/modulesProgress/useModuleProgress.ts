import {useQuery} from "@tanstack/react-query";
import {getModuleProgress, getModuleProgressList} from "./moduleProgressApi.ts";
import {getItem} from "../../utils/utils.ts";

export const useGetModulesProgressList = (studentCourseId: string | undefined) =>
    useQuery({
        queryKey: ["moduleProgressList", studentCourseId],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            if (!studentCourseId) throw new Error("No courseId");

            return await getModuleProgressList({studentCourseId});
        },
        retry: false,
        enabled: !!studentCourseId,
    });


export const useGetModulesProgressByModuleId = ({studentCourseId, moduleId}: {
    studentCourseId: string | undefined,
    moduleId: string | undefined,
}) =>
    useQuery({
        queryKey: ["moduleProgress", moduleId],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            if (!moduleId) throw new Error("No courseId");

            return await getModuleProgress({studentCourseId, moduleId});
        },
        retry: false,
    });

