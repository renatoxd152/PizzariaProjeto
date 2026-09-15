package projeto.microservices.pagamentos.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import projeto.microservices.pagamentos.model.Pagamento;
import projeto.microservices.pagamentos.subscriber.representation.PedidoRepresentation;

import javax.swing.text.html.Option;
import java.util.Optional;

public interface PagamentoRepository extends MongoRepository<Pagamento,String> {
    Optional<PedidoRepresentation> findByIdPedido (String idPedido);
}
