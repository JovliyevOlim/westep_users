import apiClient from "../apiClient";
import {User} from "../../types/types.ts";
import {AxiosError} from "axios";
import {getItem, setItem} from "../../utils/utils.ts";

export const login = async (body: { phoneNumber: string; password: string }) => {
    try {
        const {data} = await apiClient.post("/auth/login", {}, {
            params: {
                phone: body.phoneNumber,
                password: body.password,
            }
        });
        setItem<string>("accessToken", data.accessToken)
        setItem<string>("refreshToken", data.refreshToken)
    } catch (error) {
        const err = error as AxiosError<{ error: string }>;
        const message = err.response?.data?.error;
        throw new Error(message);
    }
};

export const register = async (body: User) => {
        try {
            const {data} = await apiClient.post("/auth/register", body);
            setItem<string>("accessToken", data.accessToken)
            setItem<string>("refreshToken", data.refreshToken)
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            const message = err.response?.data?.message;
            throw new Error(message);
        }
    }
;

export const getCurrentUser = async () => {
    const {data} = await apiClient.get("/user/me");
    localStorage.setItem("user", JSON.stringify(data));
    return data;
};

export const logout = async () => {
    const refreshToken: string | null = getItem<string>("refreshToken");
    await apiClient.post("/auth/logout", refreshToken, {
        headers: {
            "Content-Type": "text/plain"
        }
    });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};

export const checkPhoneNumber = async (body: { phoneNumber: string }) => {
    const {data} = await apiClient.post("/auth/check-phone", {phone: body.phoneNumber});
    if (data.status === "NOT_FOUND") {
        throw new Error(data.message);
    }
};

export const sendOtpCode = async (body: { phoneNumber: string, type: string }) => {
    try {
        await apiClient.post("/sms/send", {
            phone: body.phoneNumber,
            type: body.type,
        });
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};
export const verifyCode = async (body: { phoneNumber: string, code: string, type: string }) => {
    try {
        await apiClient.post("/sms/verify", {
            phone: body.phoneNumber,
            code: body.code,
            type: body.type,
        });
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};
export const resetPassword = async (body: { phoneNumber: string, password: string }) => {
    try {
        await apiClient.post("/auth/reset-password",{},{
            params:{
                phone: body.phoneNumber,
                newPassword: body.password,
            }
        });
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};