package projeto.microservices.pedidos.controller.mapper;
import org.mapstruct.Mapper;
import org.mapstruct.SubclassMapping;
import projeto.microservices.pedidos.controller.dto.*;
import projeto.microservices.pedidos.model.*;
import java.util.List;
@Mapper(componentModel = "spring")
public interface ItemPedidoMapper {
    ItemPedido toEntity(ItemPedidoDTO dto);
    List<ItemPedido> toEntityList(List<ItemPedidoDTO> dtos);

    @SubclassMapping(source = PizzaDTO.class, target = Pizza.class)
    @SubclassMapping(source = BebidaDTO.class, target = Bebida.class)
    Produto toProduto(ProdutoDTO dto);
    Pizza toPizza(PizzaDTO dto);
    Bebida toBebida(BebidaDTO dto);
    IngredientePizza toIngrediente(IngredienteDTO dto);
}