package projeto.microservices.pedidos.controller.dto;

import jakarta.validation.constraints.NotBlank;
import projeto.microservices.pedidos.client.representation.PizzaRepresentation;
import projeto.microservices.pedidos.model.Pizza;

import java.util.List;

public record PedidoDTO(
        @NotBlank(message = "É necessário informar o CPF do cliente!")
        String clienteCPF,
        @NotBlank(message = "É necessário informar os itens!")
        List<ItemPedidoDTO> itens) {
}
