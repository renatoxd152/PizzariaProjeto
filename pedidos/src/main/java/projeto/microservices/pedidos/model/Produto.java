package projeto.microservices.pedidos.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public abstract class Produto {
    private String id;
    private String nome;
    private BigDecimal preco;
    private String imagem;
}