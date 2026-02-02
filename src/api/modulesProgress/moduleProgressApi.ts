import apiClient from "../apiClient.ts";
import {AxiosError} from "axios";


export const getModuleProgressList = async ({studentCourseId}: {
    studentCourseId: string | undefined,
}) => {
    try {
        const {data} = await apiClient.get("/module-progress/student-courses/" + studentCourseId + "/modules/progress");
        return data;
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};

export const getModuleProgress = async ({studentCourseId, moduleId}: {
    studentCourseId: string | undefined,
    moduleId: string | undefined,
}) => {
    try {
        const {data} = await apiClient.get("/module-progress/student-courses/" + studentCourseId + "/modules" + moduleId + "/progress");
        return data;
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};
