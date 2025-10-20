import apiClient from "../apiClient";
import {User} from "../../types/types.ts";
import {AxiosError} from "axios";
import {setItem} from "../../utils/utils.ts";

const user: { name: string } = {
    name: "olim"

}

export const login = async (body: { phoneNumber: string; password: string }) => {
    console.log('ewfwefwewf')
    try {
        const {data} = await apiClient.post("/auth/login",{},{
            params:{
                phone:body.phoneNumber,
                password:body.password,
            }
        });
        setItem<string>("accessToken", data.accessToken)
        setItem<string>("refreshToken", data.refreshToken)
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};

export const checkPhoneNumber = async (body: { phoneNumber: string }) => {
    const {data} = await apiClient.post("/auth/check-phone", {phone: body.phoneNumber});
    if (data.status === "NOT_FOUND") {
        throw new Error(data.message);
    }
};

export const sendOtpCode = async (body: { phoneNumber: string, url: string }) => {
    // const {data} = await apiClient.post("/auth/login", body);
    await new Promise((r) => setTimeout(r, 800)); // test uchun delay
    if (body.phoneNumber === "+998901248664") {
        return body.phoneNumber; // success
    } else {
        throw new Error("Telefon raqami topilmadi!");
    }
};
export const verifyCode = async (body: { phoneNumber: string, otp: string, url: string }) => {
    // const {data} = await apiClient.post("/auth/login", body);
    await new Promise((r) => setTimeout(r, 800)); // test uchun delay
    if (body.phoneNumber === "+998901248664" && body.otp === "123456") {
        return user
    } else {
        throw new Error("Telefon raqami topilmadi!");
    }
};
export const createNewPassword = async (body: { phoneNumber: string, password: string }) => {
    // const {data} = await apiClient.post("/auth/login", body);

    await new Promise((r) => setTimeout(r, 800)); // test uchun delay
    if (body.phoneNumber === "+998901248664" && body.password === "123456") {
        return user
    } else {
        throw new Error("Telefon raqami topilmadi!");
    }
};