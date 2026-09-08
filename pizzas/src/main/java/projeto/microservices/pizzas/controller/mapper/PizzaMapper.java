package projeto.microservices.pizzas.controller.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;
import projeto.microservices.pizzas.controller.dto.IngredienteDTO;
import projeto.microservices.pizzas.controller.dto.PizzaDTO;
import projeto.microservices.pizzas.model.IngredientePizza;
import projeto.microservices.pizzas.model.Pizza;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PizzaMapper {

    @Mapping(source = "itens",target = "itens", qualifiedByName = "mapIngredientes")
    Pizza map(PizzaDTO pizzaDTO);

    @Named("mapIngredientes")
    default List<IngredientePizza> mapItens(List<IngredienteDTO> ingredientes)
    {
        return ingredientes.stream().map(Mappers.getMapper(IngredienteMapper.class)::map).toList();
    }

}
