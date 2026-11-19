import type {StatusPedido} from "./PedidoResponse.ts";
export enum FormaPagamentoDoPedido {
    CARTAO_CREDITO = "CARTAO_CREDITO",
    PIX = "PIX",
    DINHEIRO = "DINHEIRO",
}
export interface Pagamento {
    id?: string;
    idPedido?: string;
    statusPedido?: StatusPedido;
    valorAPagar: number;
    total?: number;
    cpf?: string;
    formaPagamento?: FormaPagamentoDoPedido;
    ultimosDigitos?: string;
    trocoPara?: number;
}