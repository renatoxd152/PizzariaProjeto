package projeto.microservices.pedidos.controller.dto;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import projeto.microservices.pedidos.model.enums.TipoProduto;
public record ItemPedidoDTO(
        @NotNull TipoProduto tipo,

        @NotNull @Valid
        @JsonTypeInfo(use = JsonTypeInfo.Id.NAME,
                include = JsonTypeInfo.As.EXTERNAL_PROPERTY,
                property = "tipo")
        @JsonSubTypes({
                @JsonSubTypes.Type(value = PizzaDTO.class, names = {"pizza", "PIZZA"}),
                @JsonSubTypes.Type(value = BebidaDTO.class, names = {"bebida", "BEBIDA"})
        })
        ProdutoDTO produto,

        @NotNull @Positive Integer quantidade) {
}