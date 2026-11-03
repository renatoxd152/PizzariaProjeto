import type { Pizza, PizzaRequest } from "../models/Pizza/Pizza.ts";
import { httpClient } from "../http";
import type {AxiosResponse} from "axios";

const resourceURL = "/pizzas";

export const useCadastroPizzaService = () => {
    const salvar = async (pizza: PizzaRequest, imagem: File): Promise<Pizza> => {
        const formData = new FormData();

        formData.append(
            "pizza",
            new Blob([JSON.stringify(pizza)], { type: "application/json" })
        );
        formData.append("imagem", imagem);

        const response = await httpClient.post<Pizza>(resourceURL, formData);
        return response.data;
    };

    const listar = async ():Promise<Pizza[]> =>
    {
        const response:AxiosResponse<Pizza[]> = await httpClient.get(resourceURL);
        return response.data;
    }

    return { salvar ,listar};
};