package projeto.microservices.pizzas.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import projeto.microservices.pizzas.model.Pizza;

public interface PizzaRepository extends MongoRepository<Pizza, String> {
}
