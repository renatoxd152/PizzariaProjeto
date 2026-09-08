package projeto.microservices.pizzas.controller.dto;

import java.math.BigDecimal;

public record IngredienteDTO(String nomeIngrediente, BigDecimal quantidade, String unidadeMedida) {
}
