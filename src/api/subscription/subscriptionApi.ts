import apiClient from "../apiClient.ts";
import {AxiosError} from "axios";

export type SubscriptionPlan = {
    id: string;
    name: string;
    slug?: string;
    tier?: number;
    monthlyPrice: number;
    description?: string | null;
    features?: string[] | null;
    planActive?: boolean;
};

export type SubscriptionStatus = "ACTIVE" | "CANCELLED" | "EXPIRED" | "PAST_DUE";

export type Subscription = {
    id: string;
    userId: string;
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    autoRenew?: boolean | null;
    cancelledAt?: string | null;
};

export type SubscriptionCard = {
    cardTokenId: string;
    maskedPan: string;
    cardExpiry: string;
    status: string;
    verifiedAt?: string | null;
};

export type SaveCardTokenRequest = {
    paymeToken: string;
    maskedPan: string;
    expiry: string;
};

function toApiError(error: unknown): Error {
    const err = error as AxiosError<{ message?: string }>;
    return new Error(err.response?.data?.message || err.message);
}

export const getSubscriptionPlans = async () => {
    try {
        const {data} = await apiClient.get<SubscriptionPlan[]>("/subscription-plans");
        return data;
    } catch (error) {
        throw toApiError(error);
    }
};

export const getMySubscription = async () => {
    try {
        const {data} = await apiClient.get<Subscription | "">("/subscriptions/my");
        return data || null;
    } catch (error) {
        throw toApiError(error);
    }
};

export const subscribeToPlan = async (planId: string) => {
    try {
        const {data} = await apiClient.post<Subscription>("/subscriptions", {planId});
        return data;
    } catch (error) {
        throw toApiError(error);
    }
};

export const changeSubscriptionPlan = async (planId: string) => {
    try {
        const {data} = await apiClient.put<Subscription>(`/subscriptions/change-plan/${planId}`);
        return data;
    } catch (error) {
        throw toApiError(error);
    }
};

export const cancelSubscription = async () => {
    try {
        const {data} = await apiClient.post<Subscription>("/subscriptions/cancel");
        return data;
    } catch (error) {
        throw toApiError(error);
    }
};

export const reactivateSubscription = async () => {
    try {
        const {data} = await apiClient.post<Subscription>("/subscriptions/reactivate");
        return data;
    } catch (error) {
        throw toApiError(error);
    }
};

export const getMyCard = async () => {
    try {
        const {data, status} = await apiClient.get<SubscriptionCard | "">("/subscriptions/card/my");
        if (status === 204 || !data) return null;
        return data;
    } catch (error) {
        throw toApiError(error);
    }
};

export const saveCardToken = async (body: SaveCardTokenRequest) => {
    try {
        const {data} = await apiClient.post<SubscriptionCard>("/subscriptions/card/save-token", body);
        return data;
    } catch (error) {
        throw toApiError(error);
    }
};

export const removeMyCard = async () => {
    try {
        await apiClient.delete("/subscriptions/card/my");
    } catch (error) {
        throw toApiError(error);
    }
};
