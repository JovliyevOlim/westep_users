// Payme Subscribe API karta tokenizatsiyasi. Karta raqami backend'ga yuborilmaydi —
// Payme protokoli merchant serverida ochiq karta ma'lumotini saqlashni taqiqlaydi,
// shuning uchun cards.create/get_verify_code/verify to'g'ridan-to'g'ri brauzerdan chaqiriladi
// va backend'ga faqat tasdiqlangan token + masked PAN ketadi.

const PAYME_CHECKOUT_URL =
    import.meta.env.VITE_PAYME_CHECKOUT_URL?.trim() || "https://checkout.paycom.uz/api";
const PAYME_MERCHANT_ID = import.meta.env.VITE_PAYME_MERCHANT_ID?.trim();

export type PaymeCard = {
    number: string;
    expire: string;
    token: string;
    recurrent?: boolean;
    verify?: boolean;
};

type PaymeRpcResponse<T> = {
    result?: T;
    error?: {
        code?: number;
        message?: string | { uz?: string; ru?: string; en?: string };
    };
};

function resolveErrorMessage(error: PaymeRpcResponse<unknown>["error"]): string {
    if (!error) return "Payme xatosi";
    if (typeof error.message === "string") return error.message;
    return error.message?.uz || error.message?.ru || error.message?.en || "Payme xatosi";
}

async function paymeRpc<T>(method: string, params: Record<string, unknown>): Promise<T> {
    if (!PAYME_MERCHANT_ID) {
        throw new Error("Payme merchant sozlanmagan (VITE_PAYME_MERCHANT_ID)");
    }

    const response = await fetch(PAYME_CHECKOUT_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Auth": PAYME_MERCHANT_ID,
        },
        body: JSON.stringify({
            id: Date.now(),
            method,
            params,
        }),
    });

    const data = (await response.json()) as PaymeRpcResponse<T>;

    if (data.error || !data.result) {
        throw new Error(resolveErrorMessage(data.error));
    }

    return data.result;
}

export const createPaymeCard = async ({number, expire}: { number: string; expire: string }) => {
    const result = await paymeRpc<{ card: PaymeCard }>("cards.create", {
        card: {number, expire},
        save: true,
    });
    return result.card;
};

export const requestPaymeCardCode = async (token: string) => {
    return paymeRpc<{ sent: boolean; phone?: string; wait?: number }>("cards.get_verify_code", {
        token,
    });
};

export const verifyPaymeCard = async ({token, code}: { token: string; code: string }) => {
    const result = await paymeRpc<{ card: PaymeCard }>("cards.verify", {token, code});
    return result.card;
};
