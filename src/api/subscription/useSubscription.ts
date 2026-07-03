import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    cancelSubscription,
    changeSubscriptionPlan,
    getMyCard,
    getMySubscription,
    getSubscriptionPlans,
    removeMyCard,
    saveCardToken,
    subscribeToPlan,
} from "./subscriptionApi.ts";
import {getItem} from "../../utils/utils.ts";

// Obuna o'zgarganda modul unlock holatlari ham o'zgaradi
const AFFECTED_QUERY_KEYS = [
    ["subscription-my"],
    ["subscription-card"],
    ["student-course-purchase-detail"],
    ["course-detail"],
    ["studentCourseModule"],
];

function useInvalidateSubscriptionQueries() {
    const queryClient = useQueryClient();
    return async () => {
        await Promise.all(
            AFFECTED_QUERY_KEYS.map((queryKey) => queryClient.invalidateQueries({queryKey})),
        );
    };
}

export const useGetSubscriptionPlans = () =>
    useQuery({
        queryKey: ["subscription-plans"],
        queryFn: getSubscriptionPlans,
        retry: false,
    });

export const useGetMySubscription = () =>
    useQuery({
        queryKey: ["subscription-my"],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            return await getMySubscription();
        },
        retry: false,
    });

export const useGetMyCard = () =>
    useQuery({
        queryKey: ["subscription-card"],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            return await getMyCard();
        },
        retry: false,
    });

export const useSubscribeToPlan = () => {
    const invalidate = useInvalidateSubscriptionQueries();
    return useMutation({
        mutationFn: subscribeToPlan,
        onSuccess: invalidate,
    });
};

export const useChangeSubscriptionPlan = () => {
    const invalidate = useInvalidateSubscriptionQueries();
    return useMutation({
        mutationFn: changeSubscriptionPlan,
        onSuccess: invalidate,
    });
};

export const useCancelSubscription = () => {
    const invalidate = useInvalidateSubscriptionQueries();
    return useMutation({
        mutationFn: cancelSubscription,
        onSuccess: invalidate,
    });
};

export const useSaveCardToken = () => {
    const invalidate = useInvalidateSubscriptionQueries();
    return useMutation({
        mutationFn: saveCardToken,
        onSuccess: invalidate,
    });
};

export const useRemoveMyCard = () => {
    const invalidate = useInvalidateSubscriptionQueries();
    return useMutation({
        mutationFn: removeMyCard,
        onSuccess: invalidate,
    });
};
