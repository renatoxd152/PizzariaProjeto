package projeto.microservices.pizzas.controller.dto;

import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.util.List;

public record PizzaDTO(
        @NotBlank(message = "É necessário informar o nome da pizza!")
        String nome,
        @NotBlank(message = "É necessário informar o preço da pizza!")
        BigDecimal preco,
        @NotBlank(message = "É necessário informar o tamanho da pizza!")
        String tamanho,
        @NotBlank(message = "É necessário informar os ingredientes da pizza!")
        List<IngredienteDTO> itens) {
}
