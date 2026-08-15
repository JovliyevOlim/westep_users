const OIDC_ORIGIN = "https://oauth.telegram.org";

export function buildTelegramAuthUrl(clientId: number, redirectPath = "/login"): string {
    const pageOrigin = window.location.origin;
    const returnTo = `${pageOrigin}${redirectPath}`;
    const params = new URLSearchParams({
        bot_id: String(clientId),
        origin: pageOrigin,
        return_to: returnTo,
        request_access: "write",
    });
    return `${OIDC_ORIGIN}/auth?${params.toString()}`;
}

export function startTelegramLoginRedirect(clientId: number): void {
    window.location.assign(buildTelegramAuthUrl(clientId));
}

export function readTelegramIdTokenFromLocation(): string | null {
    const hash = window.location.hash.startsWith("#")
        ? window.location.hash.slice(1)
        : window.location.hash;
    const hashParams = new URLSearchParams(hash);
    const queryParams = new URLSearchParams(window.location.search);

    const direct =
        hashParams.get("id_token") ||
        queryParams.get("id_token") ||
        hashParams.get("idToken") ||
        queryParams.get("idToken");
    if (direct) {
        return direct;
    }

    const packed = hashParams.get("tgAuthResult") || queryParams.get("tgAuthResult");
    if (!packed) {
        return null;
    }

    try {
        const normalized = packed.replace(/-/g, "+").replace(/_/g, "/");
        const pad = normalized.length % 4;
        const json = atob(pad ? normalized + "=".repeat(4 - pad) : normalized);
        const parsed = JSON.parse(json) as {id_token?: string; result?: string};
        return parsed.id_token || parsed.result || null;
    } catch {
        return null;
    }
}

export type TelegramWidgetAuth = {
    id: number;
    firstName?: string;
    lastName?: string;
    username?: string;
    authDate: number;
    hash: string;
};

export function readTelegramWidgetAuthFromLocation(): TelegramWidgetAuth | null {
    const packed = packedAuthResult();
    if (!packed) {
        return null;
    }
    try {
        const parsed = JSON.parse(packed) as {
            id?: number;
            first_name?: string;
            last_name?: string;
            username?: string;
            auth_date?: number;
            hash?: string;
        };
        if (!parsed.id || !parsed.hash || !parsed.auth_date) {
            return null;
        }
        return {
            id: parsed.id,
            firstName: parsed.first_name,
            lastName: parsed.last_name,
            username: parsed.username,
            authDate: parsed.auth_date,
            hash: parsed.hash,
        };
    } catch {
        return null;
    }
}

function packedAuthResult(): string | null {
    const hash = window.location.hash.startsWith("#")
        ? window.location.hash.slice(1)
        : window.location.hash;
    const hashParams = new URLSearchParams(hash);
    const queryParams = new URLSearchParams(window.location.search);
    const packed = hashParams.get("tgAuthResult") || queryParams.get("tgAuthResult");
    if (!packed) {
        return null;
    }
    try {
        const normalized = packed.replace(/-/g, "+").replace(/_/g, "/");
        const pad = normalized.length % 4;
        return atob(pad ? normalized + "=".repeat(4 - pad) : normalized);
    } catch {
        return null;
    }
}

export function readTelegramCallbackError(): string | null {
    const hash = window.location.hash.startsWith("#")
        ? window.location.hash.slice(1)
        : window.location.hash;
    const hashParams = new URLSearchParams(hash);
    const queryParams = new URLSearchParams(window.location.search);
    return (
        hashParams.get("error") ||
        queryParams.get("error") ||
        hashParams.get("error_description") ||
        queryParams.get("error_description")
    );
}
