package projeto.microservices.pedidos.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import projeto.microservices.pedidos.model.enums.TamanhoPizza;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class Pizza extends Produto {
    private TamanhoPizza tamanho;
    private List<IngredientePizza> itens;
}