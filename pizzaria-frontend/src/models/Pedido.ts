import type {Pizza} from "./Pizza/Pizza.ts";

import type {Bebida} from "./Bebida.ts";

export type ItemPedido =
    | {tipo: "pizza"; produto: Pizza; quantidade: number}
    | {tipo: "bebida"; produto: Bebida; quantidade: number};

export interface Pedido {
    clienteCPF: string;
    itens: ItemPedido[];
}