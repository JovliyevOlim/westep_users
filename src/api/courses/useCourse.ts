import {useMutation, useQuery} from "@tanstack/react-query";
import {getAllCourses, getAllStudentCoursesById, getCourseById, setStudentCourse} from "./courseApi.ts";
import {getItem} from "../../utils/utils.ts";
import {useNavigate} from "react-router-dom";

export const useGetCourses = () =>
    useQuery({
        queryKey: ["courses"],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            return await getAllCourses();
        },
        retry: false,
    });

export const useGetCourseById = (id: string | undefined) =>
    useQuery({
        queryKey: ["role", id],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            return await getCourseById(id);
        },
        enabled: !!id,
        retry: false,
    });

export const useSetStudentCourseById = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: setStudentCourse,
        onSuccess: async (id) => {
            navigate(`/course/${id}`);
        },
        onError: (error) => {
            alert(error);
        },
    });
};


export const useGetStudentCourseById = (id: string | undefined) =>
    useQuery({
        queryKey: ["role", id],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            return await getAllStudentCoursesById(id);
        },
        enabled: !!id,
        retry: false,
    });


