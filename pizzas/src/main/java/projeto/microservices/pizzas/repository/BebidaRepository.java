package projeto.microservices.pizzas.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import projeto.microservices.pizzas.model.Bebida;

public interface BebidaRepository extends MongoRepository<Bebida, String> {
}
