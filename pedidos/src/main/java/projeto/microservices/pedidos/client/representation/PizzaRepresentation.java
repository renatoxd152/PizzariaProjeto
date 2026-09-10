package projeto.microservices.pedidos.client.representation;

import java.math.BigDecimal;

public record PizzaRepresentation (String nome, BigDecimal preco, String id) {
}
