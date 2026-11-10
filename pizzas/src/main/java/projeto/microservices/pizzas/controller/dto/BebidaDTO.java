package projeto.microservices.pizzas.controller.dto;

import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

public record BebidaDTO (
        @NotBlank(message = "É necessário informar o nome da bebida!")
        String nome,
        @NotBlank(message = "É necessário informar o preço da pizza!")
        BigDecimal preco) {
}
