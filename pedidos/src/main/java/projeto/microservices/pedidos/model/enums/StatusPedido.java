package projeto.microservices.pedidos.model.enums;

public enum StatusPedido {
    PENDENTE,
    REALIZADO,
    FATURADO,
    ERRO_PAGAMENTO,
    PREPARANDO_ENVIO,
    EM_PREPARO,
    PAGAMENTO_APROVADO,
    AGUARDANDO_PAGAMENTO,
    SAIU_PARA_ENTREGA,
    ENTREGUE
}
