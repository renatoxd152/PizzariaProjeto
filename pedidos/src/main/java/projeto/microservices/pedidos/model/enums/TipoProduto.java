package projeto.microservices.pedidos.model.enums;

import com.fasterxml.jackson.annotation.JsonAlias;

public enum TipoProduto {
    @JsonAlias("pizza") PIZZA,
    @JsonAlias("bebida") BEBIDA
}