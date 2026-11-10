import {httpClient} from "../http";
import type {Bebida} from "../models/Bebida.ts";
import type {AxiosResponse} from "axios";
const resourceURL = "/bebidas";

export const useCadastroBebidaService = () => {
    const salvar = async (bebida: Bebida, imagem: File): Promise<Bebida> => {
        const formData = new FormData();

        formData.append(
            "bebida",
            new Blob([JSON.stringify(bebida)], { type: "application/json" })
        );
        formData.append("imagem", imagem);

        const response = await httpClient.post<Bebida>(resourceURL, formData);
        return response.data;
    };

    const listar = async ():Promise<Bebida[]> =>
    {
        const response:AxiosResponse<Bebida[]> = await httpClient.get(resourceURL);
        return response.data;
    }
    return{salvar,listar}
}