package projeto.microservices.pedidos.controller.dto;

import projeto.microservices.pedidos.model.enums.TamanhoPizza;

import java.math.BigDecimal;
import java.util.List;

public record PizzaDTO(String id, String nome, BigDecimal preco, TamanhoPizza tamanho, List<IngredienteDTO> itens) implements ProdutoDTO {}