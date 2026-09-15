package projeto.microservices.pagamentos.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import projeto.microservices.pagamentos.model.enums.StatusPedido;

import java.io.Serializable;
import java.math.BigDecimal;

@Document("pedidos-pagamentos")
@Getter
@Setter
public class Pagamento implements Serializable {
    @Id
    private String id;
    private String idPedido;
    private StatusPedido statusPedido;
    private BigDecimal total;
}
