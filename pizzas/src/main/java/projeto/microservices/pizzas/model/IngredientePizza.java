package projeto.microservices.pizzas.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import projeto.microservices.pizzas.model.enums.UnidadeMedida;

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
