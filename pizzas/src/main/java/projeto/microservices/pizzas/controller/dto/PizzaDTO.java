package projeto.microservices.pizzas.controller.dto;

import java.math.BigDecimal;
import java.util.List;

public record PizzaDTO(String nome, BigDecimal preco, String tamanho, List<IngredienteDTO> itens) {
}
