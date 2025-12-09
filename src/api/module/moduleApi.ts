import apiClient from "../apiClient.ts";
import {AxiosError} from "axios";
import {Module} from "../../types/types.ts";


export const getModulesById = async (id: string | undefined) => {
    try {
        const {data} = await apiClient.get("/module/course/" + id);
        const newData = data.map((item: Module, index: number) => {
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
