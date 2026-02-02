import {useMutation} from "@tanstack/react-query";
import {paymeCreate} from "./paymeApi.ts";


export const usePaymeCreate = () => {
    return useMutation({
        mutationFn: paymeCreate,
        onSuccess: async (data) => {
            console.log(data);
            window.open(data, "_blank")
        },
        onError: (error) => {
            alert(error);
        },
    });
};
