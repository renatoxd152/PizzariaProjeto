package projeto.microservices.pedidos.controller.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record PedidoDTO(
        @NotBlank(message = "É necessário informar o CPF do cliente!")
        String clienteCPF,
        @NotBlank(message = "É necessário informar os IDS das pizzas!")
        List<String> pizzasIds) {
}
