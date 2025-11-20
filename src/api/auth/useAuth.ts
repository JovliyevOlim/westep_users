// src/hooks/useAuth.ts
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {
    checkPhoneNumber,
    createNewPassword,
    getCurrentUser,
    login,
    logout,
    register,
    sendOtpCode,
    verifyCode
} from "./authApi.ts";
import {useNavigate} from "react-router-dom";
import {getItem} from "../../utils/utils.ts";

export const useUser = () =>
    useQuery({
        queryKey: ["currentUser"],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            return await getCurrentUser();
        },
        retry: false,
    });

export const useLogin = () => {
    const navigate = useNavigate();
    const qc = useQueryClient();
    return useMutation({
        mutationFn: login,
        onSuccess: async () => {
            const user = await getCurrentUser();
            qc.setQueryData(["currentUser"], user);
            navigate("/");
        },
        onError: (error) => {
            console.log(error);
        },
    });
};

export const useRegister = () => {
    const navigate = useNavigate();
    const qc = useQueryClient();
    return useMutation({
        mutationFn: register,
        onSuccess: async () => {
            const user = await getCurrentUser();
            qc.setQueryData(["currentUser"], user);
            navigate("/");
        },
        onError: (error) => {
            alert(error.message);
        }
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
            onError: (error, body: { phoneNumber: string }) => {
                console.log(error);
                navigate("/register", {state: {phoneNumber: body.phoneNumber}}); // success -> password sahifasiga o‘tish
            },
        });
    }
;

export const useOtpPhoneNumber = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: sendOtpCode,
        onSuccess: () => {
            navigate("/verify-code");
        },
        onError: (error) => {
            return error
        },
    });
};

export const useVerifyCode = () => {
    const {mutate} = useRegister();
    return useMutation({
        mutationFn: verifyCode,
        onSuccess: () => {
            const form = JSON.parse(sessionStorage.getItem("form") as string);
            mutate({
                birthDate:form.birthDate,
                firstname:form.firstName,
                lastname:form.lastName,
                password:form.password,
                gender:form.gender,
                phone:form.phoneNumber,
            })
        },
        onError: (error) => {
            return error
        },
    });
};

export const useCreateNewPassword = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: createNewPassword,
        onSuccess: () => {
            navigate("/verify-code");
        },
        onError: (error) => {
            return error
        },
    });
};