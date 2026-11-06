package projeto.microservices.pedidos.controller.dto;

public sealed interface ProdutoDTO permits PizzaDTO, BebidaDTO {}