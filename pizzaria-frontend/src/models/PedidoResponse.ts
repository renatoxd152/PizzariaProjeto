export type StatusPedido =
    | "PENDENTE"
    | "REALIZADO"
    | "FATURADO"
    | "ERRO_PAGAMENTO"
    | "PREPARANDO_ENVIO";

export interface ClienteRepresentation {
    id: string;
    nome: string;
    telefone: string;
    cpf: string;
    usuarioRole: string;
}

export interface IngredientePizza {
    id: string;
    nomeIngrediente: string;
    quantidade: number;
    unidadeMedida: string;
}

export interface BebidaPedido {
    id: string;
    nome: string;
    preco: number;
}

export interface PizzaPedido {
    id: string;
    nome: string;
    preco: number;
    tamanho: string;
    itens: IngredientePizza[];
}

export type ItemPedidoResponse =
    | { tipo: "BEBIDA"; produto: BebidaPedido; quantidade: number }
    | { tipo: "PIZZA"; produto: PizzaPedido; quantidade: number };

export interface PedidoResponse {
    id: string;
    clienteRepresentation: ClienteRepresentation;
    itens: ItemPedidoResponse[];
    total: number;
    statusPedido: StatusPedido;
}