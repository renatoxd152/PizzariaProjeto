import { httpClientUsuario } from "../http";
import type {Usuario} from "../models/Usuario/Usuario.ts";
import type {TokenResponse, UsuarioLogin} from "../models/Usuario/UsuarioLogin.ts";

const resourceURL = "/usuarios";

export const useUsuarioService = () => {
    const salvar = async (usuario: Usuario): Promise<Usuario> => {
        const response = await httpClientUsuario.post<Usuario>(
            resourceURL,
            usuario,
            { semAuth: true }
        );
        return response.data;
    };

    const login = async (usuario: UsuarioLogin): Promise<TokenResponse> => {
        const response = await httpClientUsuario.post<TokenResponse>(
            `${resourceURL}/login`,
            usuario,
            { semAuth: true }
        );
        return response.data;
    };

    return { salvar, login };
};