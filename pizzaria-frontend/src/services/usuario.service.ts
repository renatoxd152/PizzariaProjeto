import { httpClientUsuario } from "../http";
import type {Usuario} from "../models/Usuario/Usuario.ts";

const resourceURL = "/usuarios";

export const useUsuarioService = () => {
    const salvar = async (usuario: Usuario): Promise<Usuario> => {
        const response = await httpClientUsuario.post<Usuario>(resourceURL, usuario);
        return response.data;
    };

    return { salvar };
};