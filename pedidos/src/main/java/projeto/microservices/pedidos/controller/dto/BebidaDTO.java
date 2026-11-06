package projeto.microservices.pedidos.controller.dto;

import java.math.BigDecimal;

public record BebidaDTO(String id, String nome, BigDecimal preco) implements ProdutoDTO {}