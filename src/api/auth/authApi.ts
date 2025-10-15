// src/api/authApi.ts
// import apiClient from "../apiClient";
import {User} from "../../types/types.ts";

const user: { name: string } = {
    name: "olim"

}

export const login = async (body: { phoneNumber: string; password: string }) => {
    // const {data} = await apiClient.post("/auth/login", body);
    await new Promise((r) => setTimeout(r, 800)); // test uchun delay
    localStorage.setItem("accessToken", "accessToken");
    localStorage.setItem("refreshToken", "refreshToken");
    try {
        if (body.phoneNumber === "+998901248664" && body.password === "123456") {
            return user
        }
    } catch (error) {
        return error;
    }
};

export const register = async (body: User) => {
        // const {data} = await apiClient.post("/auth/register", body);
        try {
            if (body) {
                return user
            }
        } catch (error) {
            return error;
        }
    }
;

export const getCurrentUser = async () => {
    // const {data} = await apiClient.get("/auth/me");
    return user;
};

export const logout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};

export const checkPhoneNumber = async (body: { phoneNumber: string }) => {
    // const {data} = await apiClient.post("/auth/login", body);
    await new Promise((r) => setTimeout(r, 800)); // test uchun delay
    if (body.phoneNumber === "+998901248664") {
        return body.phoneNumber; // success
    } else {
        throw new Error("Telefon raqami topilmadi!");
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