import { AxiosError } from "axios";
import apiClient from "../apiClient.ts";
import type {
    ProfessionDetailDto,
    ProfessionFieldsResponse,
    ProfessionListParams,
    ProfessionListResponse,
} from "./types.ts";

function toError(error: unknown, fallback: string) {
    const err = error as AxiosError<{ message?: string }>;
    return new Error(err.response?.data?.message || err.message || fallback);
}

export async function getProfessionFields() {
    try {
        const { data } = await apiClient.get<ProfessionFieldsResponse>("/professions/fields");
        return data;
    } catch (error) {
        throw toError(error, "Sohalarni yuklab bo'lmadi");
    }
}

export async function getProfessions(params: ProfessionListParams = {}) {
    try {
        const { data } = await apiClient.get<ProfessionListResponse>("/professions", {
            params: {
                field: params.field && params.field !== "all" ? params.field : undefined,
                q: params.q?.trim() || undefined,
                limit: params.limit ?? 50,
                offset: params.offset ?? 0,
            },
        });
        return data;
    } catch (error) {
        throw toError(error, "Kasblarni yuklab bo'lmadi");
    }
}

export async function getProfessionDetail(idOrSlug: string) {
    try {
        const { data } = await apiClient.get<ProfessionDetailDto>(
            `/professions/${encodeURIComponent(idOrSlug)}`,
        );
        return data;
    } catch (error) {
        throw toError(error, "Kasb ma'lumotini yuklab bo'lmadi");
    }
}
