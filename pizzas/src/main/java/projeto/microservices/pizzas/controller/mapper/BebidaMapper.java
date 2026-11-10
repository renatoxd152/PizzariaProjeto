package projeto.microservices.pizzas.controller.mapper;

import org.mapstruct.Mapper;
import projeto.microservices.pizzas.controller.dto.BebidaDTO;
import projeto.microservices.pizzas.model.Bebida;

@Mapper(componentModel = "spring")
public interface BebidaMapper {
    Bebida map(BebidaDTO bebidaDTO);
}
