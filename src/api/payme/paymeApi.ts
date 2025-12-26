import apiClient from "../apiClient.ts";
import {AxiosError} from "axios";


export const paymeCreate = async (id: string | undefined) => {
    try {
        const {data} = await apiClient.get("/payme/payme/checkout/" + id,);
        return data.url;
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};
