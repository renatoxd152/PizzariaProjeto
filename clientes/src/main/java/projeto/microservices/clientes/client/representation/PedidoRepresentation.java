package projeto.microservices.clientes.client.representation;

import org.springframework.http.ResponseEntity;
import projeto.microservices.clientes.client.enums.StatusPedido;

import java.math.BigDecimal;
import java.util.List;

public record PedidoRepresentation(String id,
                                   StatusPedido statusPedido,
                                   BigDecimal total,
                                   List<PizzaRepresentation> pizzas) {
}
