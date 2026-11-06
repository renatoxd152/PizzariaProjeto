package projeto.microservices.pedidos.model;
import lombok.*;
import projeto.microservices.pedidos.model.enums.TipoProduto;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ItemPedido {

    private TipoProduto tipo;

    private Produto produto;

    private Integer quantidade;
}
