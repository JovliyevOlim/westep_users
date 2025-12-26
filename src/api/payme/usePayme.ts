import {useMutation} from "@tanstack/react-query";
import {paymeCreate} from "./paymeApi.ts";


export const usePaymeCreate = () => {
    return useMutation({
        mutationFn: paymeCreate,
        onSuccess: async (data) => {
            window.open(data, "_self")
        },
        onError: (error) => {
            alert(error);
        },
    });
};
