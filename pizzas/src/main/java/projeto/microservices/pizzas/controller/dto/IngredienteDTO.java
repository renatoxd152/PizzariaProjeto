package projeto.microservices.pizzas.controller.dto;

import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

public record IngredienteDTO(
        @NotBlank(message = "É necessário informar o nome do ingrediente!")
        String nomeIngrediente,
        @NotBlank(message = "É necessário informar a quantidade do ingrediente!")
        BigDecimal quantidade,
        @NotBlank(message = "É necessário informar a unidade de medida do ingrediente!")
        String unidadeMedida) {
}
