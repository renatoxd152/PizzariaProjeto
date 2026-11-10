export type StatusPedido =
    | "PENDENTE"
    | "REALIZADO"
    | "FATURADO"
    | "ERRO_PAGAMENTO"
    | "PREPARANDO_ENVIO";

export interface ClienteRepresentation {
    nome: string;
    telefone: string;
    cpf: string;
    id: string;
    usuarioRole: string;
}

export interface ProdutoPedido {
    id?: string;
    nome?: string;
    preco?: number;
}

export interface ItemPedido {
    tipo: string;
    produto: ProdutoPedido;
    quantidade: number;
}

export interface Pedido {
    id: string;
    clienteRepresentation: ClienteRepresentation;
    itens: ItemPedido[];
    total: number;
    statusPedido: StatusPedido;
}