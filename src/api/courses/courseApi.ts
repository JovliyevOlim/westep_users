import apiClient from "../apiClient.ts";
import {AxiosError} from "axios";

export const getAllCourses = async () => {
    try {
        const {data} = await apiClient.get("/course/get");
        return data;
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};


export const getAllStudentCoursesById = async (id: string | undefined) => {
    try {
        const {data} = await apiClient.get("/student-course/get-by-student/" + id);
        return data;
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};

export const setStudentCourse = async (body: { studentId: string, courseId: string | null, moduleList: string[] }) => {
    try {
        const data = await apiClient.post("/student-course", body);
        return data.data;
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};

export const getCourseById = async (id: string | undefined) => {
    const {data} = await apiClient.get("/course/get/" + id);
    return data;
};
