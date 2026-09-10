package projeto.microservices.pedidos.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import projeto.microservices.pedidos.model.Pedido;

public interface PedidoRepository extends MongoRepository<Pedido, String> {
}
