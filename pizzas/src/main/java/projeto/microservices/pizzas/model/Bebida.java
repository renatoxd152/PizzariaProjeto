package projeto.microservices.pizzas.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;

@Getter
@Setter
@RequiredArgsConstructor
@Document(collection = "bebidas")
public class Bebida {
    @Id
    private String id;
    private String nome;
    private BigDecimal preco;
    private String imagem;
}
