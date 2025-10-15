// src/hooks/useAuth.ts
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {checkPhoneNumber, getCurrentUser, login, logout, register} from "./authApi.ts";
import {useNavigate} from "react-router-dom";

export const useUser = () =>
    useQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser,
        retry: false,
    });

export const useLogin = () => {
    const navigate = useNavigate();
    const qc = useQueryClient();
    return useMutation({
        mutationFn: login,
        onSuccess: (user) => {
            qc.setQueryData(["currentUser"], user);
            navigate("/dashboard");

        },
        onError: (error) => {
            alert(error);
        },
    });
};

export const useRegister = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: register,
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ["currentUser"]});
        },
    });
};

export const useLogout = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            qc.removeQueries({queryKey: ["currentUser"]});
        },
    });
};

export const useCheckPhoneNumber = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: checkPhoneNumber,
        onSuccess: (_, body: { phoneNumber: string }) => {
            navigate("/password", {state: {phoneNumber: body.phoneNumber}});
        },
        onError: (error) => {
            console.log(error);
            navigate("/register"); // success -> password sahifasiga o‘tish
        },
    });
};