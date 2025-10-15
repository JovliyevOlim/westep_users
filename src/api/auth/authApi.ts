// src/api/authApi.ts
import apiClient from "../apiClient";

const user: any = {
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

export const register = async (body: { name: string; email: string; password: string }) => {
    const {data} = await apiClient.post("/auth/register", body);
    return data;
};

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