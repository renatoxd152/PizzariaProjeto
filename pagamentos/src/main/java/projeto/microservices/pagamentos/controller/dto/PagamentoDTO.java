package projeto.microservices.pagamentos.controller.dto;

import java.math.BigDecimal;

public record PagamentoDTO (String idPedido, BigDecimal valorAPagar) {
}
