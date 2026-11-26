package projeto.microservices.pedidos.controller.dto;

import projeto.microservices.pedidos.model.enums.StatusPedido;

public record AtualizarStatusPedidoDTO(StatusPedido statusPedido) {
}
