package projeto.microservices.pizzas.controller.mapper;

import org.mapstruct.Mapper;
import projeto.microservices.pizzas.controller.dto.IngredienteDTO;
import projeto.microservices.pizzas.model.IngredientePizza;

@Mapper(componentModel = "spring")
public interface IngredienteMapper {
    IngredientePizza map(IngredienteDTO ingredienteDTO);
}
