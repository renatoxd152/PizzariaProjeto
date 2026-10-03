package projeto.microservices.usuarios.client.representation;

import projeto.microservices.usuarios.client.enums.StatusPedido;

import java.math.BigDecimal;
import java.util.List;

public record PedidoRepresentation(String id,
                                   StatusPedido statusPedido,
                                   BigDecimal total,
                                   List<PizzaRepresentation> pizzas) {
}
