package projeto.microservices.pedidos.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import projeto.microservices.pedidos.client.representation.ClienteRepresentation;
import projeto.microservices.pedidos.client.representation.PizzaRepresentation;
import projeto.microservices.pedidos.model.enums.StatusPedido;

import java.math.BigDecimal;
import java.util.List;

@Document("pedidos")
@RequiredArgsConstructor
@Getter
@Setter
public class Pedido {
    @Id
    private String id;
    private ClienteRepresentation clienteRepresentation;
    private List<PizzaRepresentation> pizzas;
    private BigDecimal total;
    private StatusPedido statusPedido;
}
