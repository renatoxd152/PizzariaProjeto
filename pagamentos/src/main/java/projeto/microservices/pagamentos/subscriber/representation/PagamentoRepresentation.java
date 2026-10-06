package projeto.microservices.pagamentos.subscriber.representation;

import projeto.microservices.pagamentos.model.enums.StatusPedido;

import java.math.BigDecimal;

public record PagamentoRepresentation(String id,
                                      String idPedido,
                                      StatusPedido statusPedido,
                                      BigDecimal total,
                                      String cpf) {
}
