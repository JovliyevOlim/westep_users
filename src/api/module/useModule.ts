import {useQuery} from "@tanstack/react-query";
import {getModulesById} from "./moduleApi.ts";
import {getItem} from "../../utils/utils.ts";


export const useGetModuleById = (id: string | undefined) =>
    useQuery({
        queryKey: ["module", id],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            return await getModulesById(id);
        },
        enabled: !!id,
        retry: false,
    });


