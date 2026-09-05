package projeto.microservices.clientes.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import projeto.microservices.clientes.model.Cliente;

import java.util.Optional;

@Repository
public interface ClienteRepository extends MongoRepository<Cliente, String> {
    boolean existsByCpf(String cpf);
    Optional<Cliente> findByCpf(String cpf);
}
