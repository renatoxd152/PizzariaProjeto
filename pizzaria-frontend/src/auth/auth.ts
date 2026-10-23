import {jwtDecode} from "jwt-decode";

interface TokenPayload {
    sub: string;
    role?: string[];
    iat: number;
    exp: number;
}

export const estaLogado = () => {
    const token = localStorage.getItem("token");
    const expira = Number(localStorage.getItem("token_expira_em"));
    return token !== null && Date.now() < expira;
};

export const getRoles = (): string[] => {
    const token = localStorage.getItem("token");
    if (!token) return [];
    try {
        return jwtDecode<TokenPayload>(token).role ?? [];
    } catch {
        return [];
    }
};

export const rotaInicialPorRole = (roles: string[]) =>
    roles.includes("ROLE_ADMIN") ? "/cadastro/pizzas" : "/pizzas";