const OIDC_ORIGIN = "https://oauth.telegram.org";

export function buildTelegramAuthUrl(clientId: number, redirectPath = "/auth/telegram/callback"): string {
    const pageOrigin = window.location.origin;
    const redirectUri = `${pageOrigin}${redirectPath}`;
    const params = new URLSearchParams({
        response_type: "id_token",
        client_id: String(clientId),
        redirect_uri: redirectUri,
        origin: pageOrigin,
        scope: "openid profile phone",
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
