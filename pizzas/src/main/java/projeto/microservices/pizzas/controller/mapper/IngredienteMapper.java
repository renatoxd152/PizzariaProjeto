package projeto.microservices.pizzas.controller.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import projeto.microservices.pizzas.controller.dto.IngredienteDTO;
import projeto.microservices.pizzas.model.IngredientePizza;

@Mapper(componentModel = "spring")
public interface IngredienteMapper {

    @Mapping(target = "id", expression = "java(java.util.UUID.randomUUID().toString())")
    IngredientePizza map(IngredienteDTO ingredienteDTO);
}
