package projeto.microservices.pagamentos.subscriber.representation;

import projeto.microservices.pagamentos.model.enums.StatusPedido;

import java.math.BigDecimal;

public record PedidoRepresentation(String id,
                                   StatusPedido statusPedido,
                                   BigDecimal total) {
}
