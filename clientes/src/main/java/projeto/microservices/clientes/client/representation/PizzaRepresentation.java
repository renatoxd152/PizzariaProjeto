package projeto.microservices.clientes.client.representation;

import java.math.BigDecimal;

public record PizzaRepresentation(String nome, BigDecimal preco, String id) {
}
