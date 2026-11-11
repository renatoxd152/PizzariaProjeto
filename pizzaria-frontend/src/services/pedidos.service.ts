import {httpClientPedidos} from "../http";
import type {Pedido} from "../models/Pedido.ts";
import type {AxiosResponse} from "axios";
import type {PedidoResponse} from "../models/PedidoResponse.ts";

const resourceURL = "/pedidos";

export const usePedidoService = () => {
    const salvar = async (pedido: Pedido): Promise<Pedido> => {
        const response = await httpClientPedidos.post<Pedido>(resourceURL, pedido);
        return response.data;
    };

    const listar = async ():Promise<PedidoResponse[]> =>
    {
        const response:AxiosResponse<PedidoResponse[]> = await httpClientPedidos.get(resourceURL);
        return response.data;
    }

    const listarPedidosDoCliente = async (clienteId: string): Promise<PedidoResponse[]> => {
        const response: AxiosResponse<PedidoResponse[]> = await httpClientPedidos.get(
            `${resourceURL}/clientes/${clienteId}`
        );
        return response.data;
    };

    return { salvar, listar, listarPedidosDoCliente};
}