package projeto.microservices.pedidos.subscriber.representation;

import projeto.microservices.pedidos.model.enums.FormaPagamento;
import projeto.microservices.pedidos.model.enums.StatusPedido;

import java.math.BigDecimal;

public record PagamentoRepresentation(
        String id,
        String idPedido,
        StatusPedido statusPedido,
        BigDecimal total,
        String cpf,
        FormaPagamento formaPagamento
) {
}