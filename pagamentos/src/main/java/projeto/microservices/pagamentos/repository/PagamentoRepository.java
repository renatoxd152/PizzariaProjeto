package projeto.microservices.pagamentos.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import org.springframework.data.mongodb.repository.Query;
import projeto.microservices.pagamentos.model.Pagamento;
import projeto.microservices.pagamentos.subscriber.representation.PedidoRepresentation;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

public interface PagamentoRepository extends MongoRepository<Pagamento,String> {
    Optional<PedidoRepresentation> findByIdPedido (String idPedido);
    @Query("{ 'clienteRepresentation.cpf': ?0 }")
    List<Pagamento> findByCPFCliente (String cpf);
}
