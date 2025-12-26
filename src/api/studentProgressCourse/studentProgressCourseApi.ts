import apiClient from "../apiClient.ts";
import {AxiosError} from "axios";
import {getVideoByLessonId} from "../video/vedioApi.ts";
import {Lesson} from "../../types/types.ts";


export const getStudentCourseProgress = async (studentCourseId: string | undefined) => {
    try {
        const {data} = await apiClient.get("/progress/" + studentCourseId);
        const newData = data.map((item: Lesson, index: number) => {
            if (index == 0) {
                return {...item, active: true};
            }
            return {...item, active: false};
        })
        return newData;
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};

export const changeStudentCourseProgress = async (id: string | null) => {
    try {
        const {data} = await apiClient.get("/progress/update/" + id);
        const video = await getVideoByLessonId(id);
        const newData = {
            ...data, vedioUrl: video[0].storagePath
        }

        console.log("newData", newData);
        return newData;
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};
