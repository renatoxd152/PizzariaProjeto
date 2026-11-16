import {httpClientPagamentos} from "../http";
import type {AxiosResponse} from "axios";
import type {Pagamento} from "../models/Pagamento.ts";

const resourceURL = "/pagamentos";

export const usePagamentoService = () => {
    const salvar = async (pagamento: Pagamento): Promise<Pagamento> => {
        const response = await httpClientPagamentos.post<Pagamento>(resourceURL, pagamento);
        return response.data;
    };

    const listarPedido = async (pedidoID: string): Promise<Pagamento> => {
        const response: AxiosResponse<Pagamento> = await httpClientPagamentos.get(
            `${resourceURL}/pedido/${pedidoID}`
        );
        return response.data;
    };

    return { salvar, listarPedido};
}