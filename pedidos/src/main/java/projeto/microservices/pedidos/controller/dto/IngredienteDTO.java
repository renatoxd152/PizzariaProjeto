package projeto.microservices.pedidos.controller.dto;

public record IngredienteDTO(String id, String nomeIngrediente,
                             Integer quantidade, String unidadeMedida) {}
