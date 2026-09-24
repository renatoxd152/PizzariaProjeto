package projeto.microservices.pedidos.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import projeto.microservices.pedidos.client.representation.ClienteRepresentation;
import projeto.microservices.pedidos.model.Pedido;

import java.util.List;
import java.util.Optional;

public interface PedidoRepository extends MongoRepository<Pedido, String> {
    @Query("{ 'clienteRepresentation.id': ?0 }")
    List<Pedido> findByIdCliente(String id);
}
