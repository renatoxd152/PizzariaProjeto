package projeto.microservices.pedidos.controller.dto;

import java.util.List;

public record PedidoDTO(String clienteCPF, List<String> pizzasIds) {
}
