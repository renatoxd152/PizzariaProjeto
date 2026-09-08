package projeto.microservices.pizzas.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import projeto.microservices.pizzas.model.enums.TamanhoPizza;

@Getter
@Setter
@RequiredArgsConstructor
@Document(collection = "pizzas")
public class Pizza implements Serializable {
    @Id
    private String id;
    private String nome;
    private BigDecimal preco;
    private TamanhoPizza tamanho;
    private List<IngredientePizza> itens;
}
