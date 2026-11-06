package projeto.microservices.pedidos.model;

import lombok.Getter;
import lombok.Setter;
import projeto.microservices.pedidos.model.enums.UnidadeMedida;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class IngredientePizza {
    private String id = UUID.randomUUID().toString();
    private String nomeIngrediente;
    private BigDecimal quantidade;
    private UnidadeMedida unidadeMedida;
}
