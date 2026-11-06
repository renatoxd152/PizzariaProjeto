import {httpClientPedidos} from "../http";
import type {Pedido} from "../models/Pedido.ts";

const resourceURL = "/pedidos";

export const usePedidoService = () => {
    const salvar = async (pedido: Pedido): Promise<Pedido> => {
        const response = await httpClientPedidos.post<Pedido>(resourceURL, pedido);
        return response.data;
    };
    return { salvar };
}